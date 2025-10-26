import { render, screen, waitFor } from '@/libs/testing/testing-wrapper';
import type { ArticlesResponse } from '@/features/strapi-articles/api/types';
import ArticleDetailPage from './page';

// Mock the useArticleBySlug hook
vi.mock('@/features/strapi-articles/hooks', () => ({
  useArticleBySlug: vi.fn(),
}));

// Mock next/navigation
const mockNotFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}));

import { useArticleBySlug } from '@/features/strapi-articles/hooks';

const mockArticleResponse: ArticlesResponse = {
  articles: [
    {
      id: 1,
      documentId: 'test-doc-id',
      title: 'Test Article',
      description: 'This is a test article description',
      slug: 'test-article',
      blocks: [
        {
          __component: 'shared.rich-text',
          id: 1,
          body: '<p>This is the article content with <strong>HTML</strong>.</p>',
        },
      ],
      createdAt: '2025-01-10T10:00:00.000Z',
      updatedAt: '2025-01-15T10:00:00.000Z',
      publishedAt: '2025-01-15T10:00:00.000Z',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};

describe('ArticleDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(useArticleBySlug).mockReturnValue({
      article: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<ArticleDetailPage params={{ slug: 'test-article' }} />);

    expect(screen.getByText('Loading article...')).toBeInTheDocument();
  });

  it('renders article details when loaded successfully', async () => {
    vi.mocked(useArticleBySlug).mockReturnValue({
      article: mockArticleResponse.articles[0],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ArticleDetailPage params={{ slug: 'test-article' }} />);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a test article description')).toBeInTheDocument();
    expect(screen.getByText(/Published: January 15, 2025/)).toBeInTheDocument();

    // Check that blocks are rendered (rich text content)
    const blocksDiv = document.querySelector('[class*="blocks"]') ||
                      document.querySelector('[class*="richText"]');
    expect(blocksDiv).toBeInTheDocument();
  });

  it('renders article with created date when publishedAt is not available', () => {
    const articleWithoutPublishedDate = {
      ...mockArticleResponse.articles[0],
      publishedAt: undefined,
    };

    vi.mocked(useArticleBySlug).mockReturnValue({
      article: articleWithoutPublishedDate,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ArticleDetailPage params={{ slug: 'test-article' }} />);

    expect(screen.getByText(/Created: January 10, 2025/)).toBeInTheDocument();
  });

  it('handles error state', () => {
    const mockError = new Error('Failed to fetch article');

    vi.mocked(useArticleBySlug).mockReturnValue({
      article: undefined,
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });

    render(<ArticleDetailPage params={{ slug: 'test-article' }} />);

    expect(screen.getByText(/Error loading article: Failed to fetch article/)).toBeInTheDocument();
  });

  it('calls notFound when article is not found', () => {
    // Make notFound throw an error to stop rendering
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    vi.mocked(useArticleBySlug).mockReturnValue({
      article: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    // Expect the render to throw due to notFound
    expect(() => {
      render(<ArticleDetailPage params={{ slug: 'non-existent-article' }} />);
    }).toThrow('NEXT_NOT_FOUND');

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('uses correct slug from params', () => {
    const mockUseArticleBySlug = vi.mocked(useArticleBySlug);

    mockUseArticleBySlug.mockReturnValue({
      article: mockArticleResponse.articles[0],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ArticleDetailPage params={{ slug: 'my-awesome-article' }} />);

    expect(mockUseArticleBySlug).toHaveBeenCalledWith('my-awesome-article');
  });
});
