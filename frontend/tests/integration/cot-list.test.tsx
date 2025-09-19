import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CoTListPage from '../../src/pages/CoTListPage';
import { mockCotData, mockQuestionerData, mockProductData } from '../../src/data/mockData';

// Mock data for testing
const mockData = {
  cots: mockCotData,
  questioners: mockQuestionerData,
  products: mockProductData,
};

// Mock the data service
vi.mock('../../src/services/dataService', () => ({
  getCoTList: vi.fn(() => Promise.resolve(mockData.cots)),
  getQuestionerList: vi.fn(() => Promise.resolve(mockData.questioners)),
  getProductList: vi.fn(() => Promise.resolve(mockData.products)),
}));

describe('CoT List Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter CoT list by product category (증권/보험)', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Test 증권 필터
    const securitiesFilter = screen.getByLabelText('상품분류');
    fireEvent.change(securitiesFilter, { target: { value: 'SECURITIES' } });

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      // 헤더 행 제외하고 데이터 행만 확인
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });

    // Test 보험 필터
    fireEvent.change(securitiesFilter, { target: { value: 'INSURANCE' } });

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });
  });

  it('should filter CoT list by question type', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    const questionTypeFilter = screen.getByLabelText('질문유형');
    fireEvent.change(questionTypeFilter, { target: { value: 'CUSTOMER_CHARACTERISTICS' } });

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });
  });

  it('should filter CoT list by gender and age band', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Test 성별 필터
    const genderFilter = screen.getByLabelText('성별');
    fireEvent.change(genderFilter, { target: { value: 'MALE' } });

    // Test 연령대 필터
    const ageFilter = screen.getByLabelText('연령대');
    fireEvent.change(ageFilter, { target: { value: 'AGE_30' } });

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });
  });

  it('should sort CoT list by different columns', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Test 수정일 정렬 (기본값)
    const sortButton = screen.getByRole('button', { name: /수정일/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });

    // Test 상품분류 정렬
    const categorySortButton = screen.getByRole('button', { name: /상품분류/i });
    fireEvent.click(categorySortButton);

    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length - 1).toBeGreaterThan(0);
    });
  });

  it('should paginate through CoT list', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Test 페이지네이션
    const nextPageButton = screen.getByRole('button', { name: /다음/i });
    if (nextPageButton) {
      fireEvent.click(nextPageButton);

      await waitFor(() => {
        const cotRows = screen.getAllByRole('row');
        expect(cotRows.length - 1).toBeGreaterThan(0);
      });
    }

    // Test 페이지 크기 변경
    const pageSizeSelect = screen.getByLabelText(/페이지 크기/);
    if (pageSizeSelect) {
      fireEvent.change(pageSizeSelect, { target: { value: '50' } });

      await waitFor(() => {
        const cotRows = screen.getAllByRole('row');
        expect(cotRows.length - 1).toBeGreaterThan(0);
      });
    }
  });

  it('should navigate to CoT detail page when row is clicked', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Reset filters to show all data
    const productCategoryFilter = screen.getByLabelText('상품분류');
    fireEvent.change(productCategoryFilter, { target: { value: '' } });

    const questionTypeFilter = screen.getByLabelText('질문유형');
    fireEvent.change(questionTypeFilter, { target: { value: '' } });

    const genderFilter = screen.getByLabelText('성별');
    fireEvent.change(genderFilter, { target: { value: '' } });

    const ageBandFilter = screen.getByLabelText('연령대');
    fireEvent.change(ageBandFilter, { target: { value: '' } });

    // Wait for data to load
    await waitFor(() => {
      const cotRows = screen.getAllByRole('row');
      expect(cotRows.length).toBeGreaterThan(1); // Header + data rows
    });

    // Click on first CoT row
    const cotRows = screen.getAllByRole('row');
    fireEvent.click(cotRows[1]); // Skip header row

    // Should navigate to detail page
    await waitFor(() => {
      expect(window.location.pathname).toMatch(/\/cot\/\w+/);
    });
  });

  it('should maintain filter state in URL query parameters', async () => {
    render(
      <BrowserRouter>
        <CoTListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 리스트')).toBeInTheDocument();
    });

    // Apply filters
    const securitiesFilter = screen.getByLabelText('상품분류');
    fireEvent.change(securitiesFilter, { target: { value: 'SECURITIES' } });

    const genderFilter = screen.getByLabelText('성별');
    fireEvent.change(genderFilter, { target: { value: 'MALE' } });

    // Check URL contains filter parameters
    await waitFor(() => {
      expect(window.location.search).toContain('product_category=SECURITIES');
      expect(window.location.search).toContain('gender=MALE');
    });
  });
});
