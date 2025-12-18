# System Design - Grupo SER Multi-Domínio na AWS

## Visão Geral

Sistema multi-domínio para instituições educacionais do Grupo SER, hospedado na AWS com arquitetura escalável, altamente disponível e otimizada para performance global.

### Instituições Suportadas
- UNAMA (unama.com.br)
- UNINASSAU (uninassau.com.br)
- UNG (ung.edu.br)
- UNINORTE (uninorte.com.br)
- UNIFAEL (unifael.edu.br)
- UNI7 (uni7.edu.br)

---

## Arquitetura de Alto Nível

```mermaid
graph TB
    subgraph "Usuários"
        U1[Alunos UNAMA<br/>unama.com.br]
        U2[Alunos UNINASSAU<br/>uninassau.com.br]
        U3[Alunos UNG<br/>ung.edu.br]
        U4[Admin Strapi<br/>cms.gruposer.com.br]
    end

    subgraph "DNS & CDN Layer"
        R53[Route 53<br/>DNS]
        CF1[CloudFront<br/>Frontend CDN]
        CF2[CloudFront<br/>Assets CDN]
    end

    subgraph "Application Layer - us-east-1"
        ALB1[Application<br/>Load Balancer<br/>Next.js]
        ALB2[Application<br/>Load Balancer<br/>Strapi]

        subgraph "ECS Fargate Cluster"
            NEXT1[Next.js<br/>Task 1]
            NEXT2[Next.js<br/>Task 2]
            STRAPI1[Strapi<br/>Task 1]
        end
    end

    subgraph "Data Layer"
        RDS[(RDS PostgreSQL<br/>Multi-AZ)]
        S3[S3 Bucket<br/>Media Uploads]
    end

    subgraph "External APIs"
        COURSES[Courses API<br/>json-server]
        CLIENT[Client API<br/>SE Educacional]
    end

    U1 --> R53
    U2 --> R53
    U3 --> R53
    U4 --> R53

    R53 --> CF1
    R53 --> CF2
    R53 --> ALB2

    CF1 --> ALB1
    CF2 --> S3

    ALB1 --> NEXT1
    ALB1 --> NEXT2
    ALB2 --> STRAPI1

    NEXT1 --> STRAPI1
    NEXT2 --> STRAPI1
    NEXT1 --> COURSES
    NEXT1 --> CLIENT

    STRAPI1 --> RDS
    STRAPI1 --> S3

    style CF1 fill:#FF9900
    style CF2 fill:#FF9900
    style ALB1 fill:#FF9900
    style ALB2 fill:#FF9900
    style RDS fill:#527FFF
    style S3 fill:#569A31
    style NEXT1 fill:#FF9900
    style NEXT2 fill:#FF9900
    style STRAPI1 fill:#FF9900
```

---

## Fluxo de Request - Frontend

```mermaid
sequenceDiagram
    actor User
    participant CF as CloudFront
    participant ALB as Application LB
    participant Next as Next.js (ECS)
    participant Strapi as Strapi CMS
    participant CoursesAPI as Courses API
    participant RDS as PostgreSQL

    User->>CF: GET unama.com.br/cursos

    CF->>CF: Check cache
    alt Cache HIT
        CF-->>User: Return cached HTML (fast!)
    else Cache MISS or ISR
        CF->>ALB: Forward request
        ALB->>Next: Route to healthy task

        Next->>Next: Middleware: detect domain<br/>unama.com.br → institution=unama

        par Parallel API Calls (BFF)
            Next->>Strapi: GET /api/institutions?slug=unama
            Strapi->>RDS: Query institution data
            RDS-->>Strapi: Return data
            Strapi-->>Next: Institution config
        and
            Next->>CoursesAPI: GET /api/courses?institution=unama
            CoursesAPI-->>Next: Courses list
        end

        Next->>Next: Render React Server Components
        Next-->>ALB: HTML + React payload
        ALB-->>CF: Response + Cache-Control headers
        CF->>CF: Cache response (ISR)
        CF-->>User: Return HTML
    end

    Note over CF: Subsequent requests<br/>served from edge cache
```

---

## Fluxo de Revalidação (ISR)

```mermaid
sequenceDiagram
    actor Admin
    participant Strapi as Strapi Admin
    participant RDS as PostgreSQL
    participant Webhook as Strapi Webhook
    participant Next as Next.js API
    participant CF as CloudFront

    Admin->>Strapi: Update course content
    Strapi->>RDS: UPDATE courses
    RDS-->>Strapi: OK

    Strapi->>Webhook: Trigger webhook<br/>entry.update event

    Webhook->>Next: POST /api/revalidate<br/>Authorization: Bearer SECRET<br/>{path: "/cursos/[slug]"}

    Next->>Next: Validate token
    Next->>Next: revalidatePath()
    Next->>Next: Mark cache as stale

    Next-->>Webhook: 200 OK {revalidated: true}

    Note over Next: Next request will<br/>regenerate page

    Next->>CF: Request cache invalidation<br/>(via CloudFront API)
    CF->>CF: Invalidate edge cache

    Note over CF: Next user request<br/>fetches fresh content
```

---

## Arquitetura de Rede (VPC)

```mermaid
graph TB
    subgraph "AWS us-east-1"
        subgraph "VPC 10.0.0.0/16"
            subgraph "Availability Zone A"
                PUB1[Public Subnet<br/>10.0.1.0/24]
                PRIV1[Private Subnet<br/>10.0.11.0/24]
                DB1[Database Subnet<br/>10.0.21.0/24]

                ALB1[ALB Node 1]
                NEXT1[Next.js Task]
                STRAPI1[Strapi Task]
                RDS1[(RDS Primary)]
            end

            subgraph "Availability Zone B"
                PUB2[Public Subnet<br/>10.0.2.0/24]
                PRIV2[Private Subnet<br/>10.0.12.0/24]
                DB2[Database Subnet<br/>10.0.22.0/24]

                ALB2[ALB Node 2]
                NEXT2[Next.js Task]
                RDS2[(RDS Standby)]
            end

            IGW[Internet Gateway]
            NAT[NAT Gateway]
        end

        CF[CloudFront<br/>Edge Locations]
    end

    INTERNET[Internet]

    INTERNET --> CF
    CF --> IGW
    IGW --> PUB1
    IGW --> PUB2

    PUB1 --> ALB1
    PUB2 --> ALB2

    PUB1 --> NAT
    NAT --> PRIV1
    NAT --> PRIV2

    ALB1 --> NEXT1
    ALB1 --> STRAPI1
    ALB2 --> NEXT2

    NEXT1 --> PRIV1
    NEXT2 --> PRIV2
    STRAPI1 --> PRIV1

    STRAPI1 --> DB1
    DB1 --> RDS1
    DB2 --> RDS2

    RDS1 -.Sync replication.-> RDS2

    style PUB1 fill:#90EE90
    style PUB2 fill:#90EE90
    style PRIV1 fill:#FFB6C1
    style PRIV2 fill:#FFB6C1
    style DB1 fill:#FFE4B5
    style DB2 fill:#FFE4B5
    style RDS1 fill:#527FFF
    style RDS2 fill:#527FFF
```

---

## Multi-Domínio: Middleware Flow

```mermaid
flowchart TD
    START[Request arrives] --> MW{Middleware}

    MW --> CHECK_HOST{Check Host header}

    CHECK_HOST -->|unama.com.br| SET_UNAMA[Set institution = 'unama']
    CHECK_HOST -->|uninassau.com.br| SET_UNINASSAU[Set institution = 'uninassau']
    CHECK_HOST -->|ung.edu.br| SET_UNG[Set institution = 'ung']
    CHECK_HOST -->|uninorte.com.br| SET_UNINORTE[Set institution = 'uninorte']
    CHECK_HOST -->|unifael.edu.br| SET_UNIFAEL[Set institution = 'unifael']
    CHECK_HOST -->|uni7.edu.br| SET_UNI7[Set institution = 'uni7']
    CHECK_HOST -->|localhost:3000| SET_DEFAULT[Set institution = 'grupo-ser']

    SET_UNAMA --> COOKIE[Set cookie: institution=unama]
    SET_UNINASSAU --> COOKIE
    SET_UNG --> COOKIE
    SET_UNINORTE --> COOKIE
    SET_UNIFAEL --> COOKIE
    SET_UNI7 --> COOKIE
    SET_DEFAULT --> COOKIE

    COOKIE --> INJECT[Inject into request headers]
    INJECT --> NEXT_HANDLER[Continue to Next.js handler]

    NEXT_HANDLER --> PAGE[Page reads institution]
    PAGE --> API[API routes use institution filter]
    API --> STRAPI[Query Strapi with institution]

    style MW fill:#4A90E2
    style COOKIE fill:#7ED321
    style STRAPI fill:#8B572A
```

---

## CI/CD Pipeline

```mermaid
flowchart LR
    subgraph "Developer Workflow"
        DEV[Developer]
        COMMIT[git commit -m 'feat: ...']
        PUSH[git push origin main]
    end

    subgraph "GitHub Actions"
        TRIGGER[Workflow triggered]
        SR[Semantic Release]
        TAG[Create tag v1.2.3]
    end

    subgraph "Build & Deploy - Next.js"
        BUILD_NEXT[Docker build Next.js]
        ECR_NEXT[Push to ECR<br/>grupo-ser/next:1.2.3]
        TASK_NEXT[Update ECS Task Definition]
        DEPLOY_NEXT[Deploy to ECS Fargate]
        INVALIDATE[Invalidate CloudFront cache]
    end

    subgraph "Build & Deploy - Strapi"
        BUILD_STRAPI[Docker build Strapi]
        ECR_STRAPI[Push to ECR<br/>grupo-ser/strapi:1.2.3]
        TASK_STRAPI[Update ECS Task Definition]
        DEPLOY_STRAPI[Deploy to ECS Fargate]
        MIGRATE[Wait for DB migrations]
    end

    subgraph "Monitoring"
        HEALTH[Health checks]
        ALERT[CloudWatch alarms]
        NOTIFY[Slack/Email notification]
    end

    DEV --> COMMIT
    COMMIT --> PUSH
    PUSH --> TRIGGER

    TRIGGER --> SR
    SR --> TAG

    TAG -->|v*| BUILD_NEXT
    TAG -->|strapi-v*| BUILD_STRAPI

    BUILD_NEXT --> ECR_NEXT
    ECR_NEXT --> TASK_NEXT
    TASK_NEXT --> DEPLOY_NEXT
    DEPLOY_NEXT --> INVALIDATE

    BUILD_STRAPI --> ECR_STRAPI
    ECR_STRAPI --> TASK_STRAPI
    TASK_STRAPI --> DEPLOY_STRAPI
    DEPLOY_STRAPI --> MIGRATE

    INVALIDATE --> HEALTH
    MIGRATE --> HEALTH
    HEALTH --> ALERT
    ALERT --> NOTIFY

    style SR fill:#FF6B6B
    style TAG fill:#4ECDC4
    style DEPLOY_NEXT fill:#95E1D3
    style DEPLOY_STRAPI fill:#95E1D3
    style NOTIFY fill:#F38181
```

---

## Estratégia de Cache Multi-Layer

```mermaid
graph LR
    USER[User Request] --> L1{CloudFront Cache<br/>Edge Location}

    L1 -->|HIT| EDGE_RETURN[Return from Edge<br/>~10ms latency]
    L1 -->|MISS| L2{CloudFront Regional Cache}

    L2 -->|HIT| REGIONAL_RETURN[Return from Regional<br/>~50ms latency]
    L2 -->|MISS| L3[Origin: ALB + Next.js]

    L3 --> L4{Next.js ISR Cache}
    L4 -->|HIT| ISR_RETURN[Return cached page<br/>~100ms latency]
    L4 -->|MISS/STALE| L5[Regenerate page]

    L5 --> L6{Data Sources}
    L6 --> STRAPI_CACHE[Strapi API<br/>with s-maxage]
    L6 --> COURSES_CACHE[Courses API<br/>with cache]

    STRAPI_CACHE --> DB[(PostgreSQL)]

    EDGE_RETURN --> USER_RESPONSE[Response]
    REGIONAL_RETURN --> USER_RESPONSE
    ISR_RETURN --> USER_RESPONSE
    L5 --> USER_RESPONSE

    style L1 fill:#FF9900
    style L2 fill:#FF9900
    style L4 fill:#61DAFB
    style STRAPI_CACHE fill:#8B572A
    style DB fill:#527FFF
```

### TTLs por Tipo de Conteúdo

| Tipo | CloudFront | Next.js ISR | Strapi API |
|------|-----------|------------|------------|
| Páginas dinâmicas | 5 min | On-demand revalidate | 5 min |
| Assets estáticos (_next/static) | 1 ano | N/A | N/A |
| Imagens (uploads) | 1 ano | N/A | N/A |
| API routes | No cache | N/A | Vary by endpoint |
| Curriculum/FAQ | 1 hora | On-demand | 1 hora |

---

## Segurança

```mermaid
graph TB
    subgraph "Perímetro Externo"
        CF[CloudFront + WAF]
        R53[Route 53<br/>DNSSEC]
    end

    subgraph "Application Layer Security"
        ALB[ALB with SSL/TLS]
        SG_ALB[Security Group<br/>HTTPS only from CF]
        SG_ECS[Security Group<br/>HTTP from ALB only]
    end

    subgraph "Data Layer Security"
        SG_RDS[Security Group<br/>PostgreSQL 5432<br/>from ECS only]
        ENCRYPT_RDS[Encryption at rest<br/>AWS KMS]
        S3_PRIVATE[S3 Private Bucket<br/>OAC access only]
    end

    subgraph "Identity & Access"
        IAM[IAM Roles]
        SECRETS[Secrets Manager<br/>Database credentials<br/>API tokens]
        SSO[Auth0 SSO<br/>for Strapi Admin]
    end

    subgraph "Monitoring & Compliance"
        CLOUDTRAIL[CloudTrail<br/>API audit logs]
        GUARDDUTY[GuardDuty<br/>Threat detection]
        CONFIG[AWS Config<br/>Compliance checks]
    end

    R53 --> CF
    CF --> ALB
    ALB --> SG_ALB
    SG_ALB --> SG_ECS
    SG_ECS --> SG_RDS

    SG_ECS --> S3_PRIVATE
    SG_RDS --> ENCRYPT_RDS

    SG_ECS --> IAM
    IAM --> SECRETS

    CF --> CLOUDTRAIL
    SG_ECS --> GUARDDUTY
    ENCRYPT_RDS --> CONFIG

    ALB --> SSO

    style CF fill:#FF4136
    style SG_ALB fill:#FF851B
    style SG_ECS fill:#FF851B
    style SG_RDS fill:#FF851B
    style SECRETS fill:#2ECC40
    style SSO fill:#0074D9
```

### Checklist de Segurança

#### Rede
- ✅ VPC com subnets públicas e privadas
- ✅ NAT Gateway para saída privada
- ✅ Security Groups com princípio do menor privilégio
- ✅ NACLs para controle adicional
- ✅ VPC Flow Logs habilitados

#### Aplicação
- ✅ WAF na CloudFront (proteção DDoS, SQL injection, XSS)
- ✅ Rate limiting por IP
- ✅ SSL/TLS em todas as comunicações
- ✅ Headers de segurança (HSTS, CSP, X-Frame-Options)
- ✅ Validação de input em API routes

#### Dados
- ✅ RDS com encryption at rest (KMS)
- ✅ RDS com encryption in transit (SSL)
- ✅ Backups automáticos (7 dias retenção)
- ✅ S3 com encryption (AES-256)
- ✅ S3 com versionamento
- ✅ S3 bucket privado (acesso via OAC)

#### Identidade
- ✅ IAM roles com permissões mínimas
- ✅ Secrets Manager para credenciais
- ✅ Rotação automática de secrets
- ✅ MFA para acesso ao admin
- ✅ SSO via Auth0/Okta

#### Monitoramento
- ✅ CloudTrail para auditoria
- ✅ GuardDuty para detecção de ameaças
- ✅ AWS Config para compliance
- ✅ CloudWatch Logs centralizados
- ✅ Alertas para atividades suspeitas

---

## Disaster Recovery

### RTO & RPO

| Cenário | RTO (Recovery Time) | RPO (Data Loss) |
|---------|---------------------|-----------------|
| ECS task failure | < 2 min | 0 (stateless) |
| Availability Zone failure | < 5 min | 0 |
| Region failure | < 4 hours | < 5 min |
| Data corruption | < 1 hour | < 15 min |

### Estratégia de Backup

```mermaid
graph LR
    subgraph "Continuous Backup"
        RDS[RDS Automated Backups<br/>Every 5 minutes]
        SNAPSHOT[Daily Snapshots<br/>Retained 7 days]
        S3_VERSIONING[S3 Versioning<br/>All uploads]
    end

    subgraph "Cross-Region Replication"
        RDS_REPLICA[RDS Read Replica<br/>us-west-2 optional]
        S3_REPLICA[S3 Cross-Region<br/>Replication optional]
    end

    subgraph "Point-in-Time Recovery"
        PITR[PITR available<br/>Last 7 days]
        RESTORE[Restore to any<br/>5-min interval]
    end

    RDS --> SNAPSHOT
    SNAPSHOT --> PITR
    PITR --> RESTORE

    RDS -.Optional.-> RDS_REPLICA
    S3_VERSIONING -.Optional.-> S3_REPLICA

    style RDS fill:#527FFF
    style SNAPSHOT fill:#FF9900
    style PITR fill:#7ED321
```

### Plano de Rollback

1. **Code Rollback**: Deploy tag anterior via GitHub Actions
2. **Database Rollback**: Restore snapshot RDS (último 5 min)
3. **DNS Rollback**: Alterar CNAME no Route 53 (TTL 300s = 5 min)
4. **Cache Rollback**: Invalidate CloudFront para forçar novo fetch

---

## Observabilidade

### Dashboard CloudWatch

```mermaid
graph TB
    subgraph "Application Metrics"
        NEXT_METRICS[Next.js Metrics<br/>- Response time<br/>- Error rate<br/>- Request count]
        STRAPI_METRICS[Strapi Metrics<br/>- API latency<br/>- Upload success rate<br/>- Admin sessions]
    end

    subgraph "Infrastructure Metrics"
        ECS_METRICS[ECS Metrics<br/>- CPU utilization<br/>- Memory usage<br/>- Task count]
        RDS_METRICS[RDS Metrics<br/>- Connections<br/>- CPU<br/>- IOPS]
    end

    subgraph "CDN Metrics"
        CF_METRICS[CloudFront Metrics<br/>- Cache hit ratio<br/>- Error rate<br/>- Origin latency]
    end

    subgraph "Cost Metrics"
        COST[Cost Explorer<br/>- Daily spend by service<br/>- Forecast<br/>- Anomaly detection]
    end

    subgraph "Alerts"
        ALARM1[CPU > 80%]
        ALARM2[Error rate > 1%]
        ALARM3[RDS connections > 90%]
        ALARM4[Cost spike > 20%]
    end

    NEXT_METRICS --> ALARM2
    ECS_METRICS --> ALARM1
    RDS_METRICS --> ALARM3
    COST --> ALARM4

    ALARM1 --> SNS[SNS Topic]
    ALARM2 --> SNS
    ALARM3 --> SNS
    ALARM4 --> SNS

    SNS --> EMAIL[Email]
    SNS --> SLACK[Slack]
    SNS --> PAGERDUTY[PagerDuty]

    style ALARM1 fill:#FF4136
    style ALARM2 fill:#FF4136
    style ALARM3 fill:#FF4136
    style ALARM4 fill:#FF4136
```

### Logs Centralizados

```
CloudWatch Log Groups:
├── /ecs/next-frontend
│   ├── [timestamp] INFO: Request to /cursos duration=120ms
│   ├── [timestamp] ERROR: Strapi API timeout
│   └── [timestamp] WARN: Cache miss ratio high
├── /ecs/strapi-backend
│   ├── [timestamp] INFO: Upload to S3 success
│   ├── [timestamp] ERROR: Database connection pool exhausted
│   └── [timestamp] INFO: Webhook triggered revalidation
├── /aws/lambda/edge (se usar Lambda@Edge)
├── /aws/rds/postgresql
└── /aws/cloudfront/access-logs
```

---

## Escalabilidade

### Auto Scaling Triggers

```mermaid
graph TB
    METRIC_CPU[CPU > 70%<br/>for 5 minutes] --> SCALE_OUT_ECS[Scale OUT<br/>+1 ECS Task]
    METRIC_REQUESTS[Requests > 1000/min] --> SCALE_OUT_ECS

    METRIC_LOW_CPU[CPU < 30%<br/>for 10 minutes] --> SCALE_IN_ECS[Scale IN<br/>-1 ECS Task]

    METRIC_RDS[Database connections > 80%] --> SCALE_RDS[Vertical Scale<br/>Larger instance]

    METRIC_STORAGE[Storage > 80%] --> SCALE_STORAGE[Increase storage<br/>+20 GB]

    SCALE_OUT_ECS --> COOLDOWN_OUT[Cooldown 5 min]
    SCALE_IN_ECS --> COOLDOWN_IN[Cooldown 10 min]

    style SCALE_OUT_ECS fill:#7ED321
    style SCALE_IN_ECS fill:#FF851B
    style SCALE_RDS fill:#0074D9
```

### Capacity Planning

| Componente | Atual | 10x Traffic | 100x Traffic |
|-----------|-------|-------------|--------------|
| **Next.js Tasks** | 2 | 5 | 20 |
| **Strapi Tasks** | 1 | 2 | 5 |
| **RDS Instance** | db.t4g.small | db.r6g.large | db.r6g.2xlarge |
| **CloudFront** | Auto-scale | Auto-scale | Auto-scale |
| **S3** | Unlimited | Unlimited | Unlimited |
| **Custo Mensal** | ~$190 | ~$500 | ~$2,000 |

---

## Performance Benchmarks (Esperado)

### Latência por Região

| Localização | CloudFront Edge | Sem CDN (direto ECS) |
|-------------|-----------------|----------------------|
| São Paulo | 20-50ms | 150-250ms |
| Rio de Janeiro | 25-60ms | 180-280ms |
| Nordeste | 40-80ms | 200-350ms |
| Sul | 30-70ms | 180-300ms |
| Internacional | 100-300ms | 500-1000ms |

### Throughput

- **Next.js (2 tasks)**: ~500 req/s
- **Strapi (1 task)**: ~200 req/s
- **RDS (db.t4g.small)**: ~1000 connections, ~5000 queries/s
- **CloudFront**: Unlimited (distributed)

### Core Web Vitals (Objetivo)

| Métrica | Objetivo | Atual (Vercel) |
|---------|----------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ~3.0s |
| **FID** (First Input Delay) | < 100ms | ~80ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ~0.05 |
| **TTFB** (Time to First Byte) | < 600ms | ~800ms |

**Melhorias esperadas:**
- LCP: -30% (CloudFront edge cache mais próximo)
- TTFB: -50% (ISR + cache agressivo)

---

## Custos Detalhados (us-east-1)

### Breakdown Mensal - Tráfego Médio

```mermaid
pie title Distribuição de Custos (~$190/mês)
    "ECS Fargate (Next.js)" : 35
    "ECS Fargate (Strapi)" : 35
    "RDS PostgreSQL" : 60
    "ALB (2x)" : 35
    "CloudFront" : 10
    "Outros (S3, Route53, etc)" : 15
```

### Calculadora de Custos por Tráfego

| Tráfego Diário | Usuários Ativos | Custo Mensal | Custo por Usuário |
|----------------|-----------------|--------------|-------------------|
| 10k requests | ~3k | $190 | $0.063 |
| 100k requests | ~30k | $280 | $0.009 |
| 1M requests | ~300k | $650 | $0.002 |
| 10M requests | ~3M | $2,500 | $0.0008 |

### Comparação com Vercel

| Cenário | AWS (este design) | Vercel Pro | Vercel Enterprise |
|---------|-------------------|------------|-------------------|
| **100k req/dia** | $190/mês | $20/mês (insuficiente) | $400/mês |
| **1M req/dia** | $280/mês | Impossível (limites) | $1,200/mês |
| **10M req/dia** | $650/mês | Impossível | $5,000/mês |

**Ponto de Break-Even:** ~500k requests/dia (AWS fica mais barato)

---

## Roadmap de Implementação

### Fase 1: Preparação (Semana 1)
- [ ] Provisionar VPC e subnets
- [ ] Criar RDS PostgreSQL Multi-AZ
- [ ] Configurar S3 buckets
- [ ] Criar ECR repositories
- [ ] Configurar Secrets Manager

### Fase 2: Strapi Migration (Semana 2)
- [ ] Instalar plugin S3 no Strapi
- [ ] Configurar database para RDS
- [ ] Build Dockerfile Strapi
- [ ] Deploy ECS Fargate (Strapi)
- [ ] Migrar dados do Strapi Cloud para RDS
- [ ] Testar upload de imagens para S3

### Fase 3: Next.js Migration (Semana 3)
- [ ] Implementar middleware multi-domínio
- [ ] Configurar imagens para CDN direto
- [ ] Adicionar endpoint de revalidação
- [ ] Build Dockerfile Next.js
- [ ] Deploy ECS Fargate (Next.js)
- [ ] Configurar ALB e health checks

### Fase 4: CDN & DNS (Semana 4)
- [ ] Criar CloudFront distributions (frontend + assets)
- [ ] Configurar ACM certificates
- [ ] Configurar Route 53 ou DNS externo
- [ ] Testar multi-domínio em staging
- [ ] Migrar DNS para produção (gradual)

### Fase 5: CI/CD & Monitoring (Semana 5)
- [ ] Configurar GitHub Actions workflows
- [ ] Implementar Semantic Release
- [ ] Criar CloudWatch dashboards
- [ ] Configurar alarmes e notificações
- [ ] Documentar runbooks

### Fase 6: Otimização (Semana 6)
- [ ] Fine-tuning de cache policies
- [ ] Ajustar auto-scaling thresholds
- [ ] Implementar cost optimization
- [ ] Load testing e ajustes de performance
- [ ] Treinamento do time

---

## Contatos e Suporte

### Runbooks Críticos

**1. Scale up manual:**
```bash
aws ecs update-service \
  --cluster grupo-ser-production \
  --service next-frontend-service \
  --desired-count 4
```

**2. Invalidar cache CloudFront:**
```bash
aws cloudfront create-invalidation \
  --distribution-id E123456789 \
  --paths "/*"
```

**3. Rollback para versão anterior:**
```bash
# Via GitHub
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3
git push origin v1.2.2  # Trigger redeploy
```

**4. Restaurar banco de dados:**
```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier grupo-ser-prod \
  --target-db-instance-identifier grupo-ser-prod-restored \
  --restore-time 2024-01-15T10:30:00Z
```

---

## Anexos

### Stack Tecnológico Completo

```
Frontend:
├── Next.js 15 (App Router)
├── React 18
├── TypeScript 5
└── Sass

Backend:
├── Strapi 4
├── Node.js 20
└── PostgreSQL 15

Infraestrutura:
├── AWS ECS Fargate
├── AWS RDS (PostgreSQL Multi-AZ)
├── AWS S3
├── AWS CloudFront
├── AWS Application Load Balancer
├── AWS Route 53
├── AWS Secrets Manager
├── AWS CloudWatch

CI/CD:
├── GitHub Actions
├── Semantic Release
├── Docker
└── AWS ECR

Observabilidade:
├── CloudWatch Logs
├── CloudWatch Metrics
├── CloudWatch Alarms
└── AWS X-Ray (opcional)

Segurança:
├── AWS WAF
├── AWS GuardDuty
├── AWS Config
├── AWS CloudTrail
└── Auth0 SSO
```

---

## Glossário

- **ISR**: Incremental Static Regeneration - páginas estáticas regeneradas on-demand
- **BFF**: Backend-for-Frontend - camada intermediária de API
- **OAC**: Origin Access Control - acesso controlado S3 → CloudFront
- **Multi-AZ**: Multi Availability Zone - alta disponibilidade
- **PITR**: Point-in-Time Recovery - restore para qualquer momento
- **RTO**: Recovery Time Objective - tempo máximo de indisponibilidade
- **RPO**: Recovery Point Objective - perda máxima de dados aceitável
- **TTL**: Time-to-Live - tempo de cache

---

**Documento gerado para:** Grupo SER
**Data:** Dezembro 2024
**Versão:** 1.0
**Autor:** System Design Team

---

## Aprovações Necessárias

- [ ] CTO - Arquitetura técnica
- [ ] CFO - Orçamento e custos
- [ ] Head de Infraestrutura - Recursos AWS
- [ ] Head de Desenvolvimento - Timeline de implementação
- [ ] Jurídico - Compliance e LGPD
- [ ] Marketing - Estratégia multi-domínio
