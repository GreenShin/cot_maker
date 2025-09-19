import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CoTDetailPage from '../../src/pages/CoTDetailPage';
import { mockCotData, mockQuestionerData, mockProductData } from '../../src/data/mockData';

// Mock useParams to return a valid CoT ID
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'cot1' }),
  };
});

// Mock data for testing
const mockData = {
  cots: mockCotData,
  questioners: mockQuestionerData,
  products: mockProductData,
};

// Mock the data service
vi.mock('../../src/services/dataService', () => ({
  getCoTById: vi.fn((id: string) => Promise.resolve(mockData.cots.find(cot => cot.id === id))),
  getQuestionerList: vi.fn(() => Promise.resolve(mockData.questioners)),
  getProductList: vi.fn(() => Promise.resolve(mockData.products)),
  updateCoT: vi.fn(() => Promise.resolve()),
}));

describe('CoT Detail Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display CoT detail page with three sections', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Check three main sections
    expect(screen.getByText('질문자 선택')).toBeInTheDocument();
    expect(screen.getByText('CoT 편집')).toBeInTheDocument();
    expect(screen.getByText('상품 선택')).toBeInTheDocument();
  });

  it('should show unsaved changes warning when form is modified', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Modify question text
    const questionTextarea = screen.getByLabelText('질문');
    fireEvent.change(questionTextarea, { target: { value: '수정된 질문 내용' } });

    // Should show unsaved changes warning
    await waitFor(() => {
      expect(screen.getByText('저장되지 않은 변경사항이 있습니다')).toBeInTheDocument();
    });
  });

  it('should prevent navigation when there are unsaved changes', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Modify form
    const questionTextarea = screen.getByLabelText('질문');
    fireEvent.change(questionTextarea, { target: { value: '수정된 질문 내용' } });

    // Try to navigate away
    const backButton = screen.getByRole('button', { name: /뒤로가기/i });
    fireEvent.click(backButton);

    // Should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByText('변경사항을 저장하지 않고 나가시겠습니까?')).toBeInTheDocument();
    });
  });

  it('should save CoT changes and show success feedback', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Modify form
    const questionTextarea = screen.getByLabelText('질문');
    fireEvent.change(questionTextarea, { target: { value: '수정된 질문 내용' } });

    // Save changes
    const saveButton = screen.getByRole('button', { name: /저장/i });
    fireEvent.click(saveButton);

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('저장되었습니다!')).toBeInTheDocument();
    });
  });

  it('should validate CoT form fields', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Clear required fields
    const questionTextarea = screen.getByLabelText('질문');
    fireEvent.change(questionTextarea, { target: { value: '' } });

    // Try to save
    const saveButton = screen.getByRole('button', { name: /저장/i });
    fireEvent.click(saveButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('질문은 필수 입력 항목입니다')).toBeInTheDocument();
    });
  });

  it('should allow adding and removing CoT steps', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Add new CoT step
    const addStepButton = screen.getByRole('button', { name: /단계 추가/i });
    fireEvent.click(addStepButton);

    // Should show new step input
    await waitFor(() => {
      const stepInputs = screen.getAllByLabelText(/CoT 단계/);
      expect(stepInputs.length).toBeGreaterThan(3); // 기본 3단계 + 추가된 단계
    });

    // Remove a step
    const removeStepButton = screen.getByRole('button', { name: /단계 삭제/i });
    fireEvent.click(removeStepButton);

    // Should have fewer steps
    await waitFor(() => {
      const stepInputs = screen.getAllByLabelText(/CoT 단계/);
      expect(stepInputs.length).toBeLessThan(4);
    });
  });

  it('should allow selecting questioner from left panel', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Select a questioner
    const questionerList = screen.getByTestId('questioner-list');
    const questionerItems = questionerList.querySelectorAll('[data-testid="questioner-item"]');
    
    if (questionerItems.length > 0) {
      fireEvent.click(questionerItems[0]);

      // Should show selected questioner
      await waitFor(() => {
        expect(screen.getByText('선택된 질문자: q1')).toBeInTheDocument();
      });
    }
  });

  it('should allow selecting products from right panel', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Select products
    const productList = screen.getByTestId('product-list');
    const productItems = productList.querySelectorAll('[data-testid="product-item"]');
    
    if (productItems.length > 0) {
      fireEvent.click(productItems[0]);

      // Should show selected product
      await waitFor(() => {
        expect(screen.getByText('선택된 상품: p2')).toBeInTheDocument();
      });
    }
  });

  it('should validate product category consistency', async () => {
    render(
      <BrowserRouter>
        <CoTDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CoT 상세')).toBeInTheDocument();
    });

    // Set product category to 증권
    const categorySelect = screen.getByLabelText('상품분류');
    fireEvent.change(categorySelect, { target: { value: 'SECURITIES' } });

    // Select insurance product (should show warning)
    const productList = screen.getByTestId('product-list');
    const insuranceProduct = productList.querySelector('[data-testid="product-item-insurance"]');
    
    if (insuranceProduct) {
      fireEvent.click(insuranceProduct);

      // Try to save to trigger validation
      const saveButton = screen.getByRole('button', { name: /저장/i });
      fireEvent.click(saveButton);

      // Should show consistency warning
      await waitFor(() => {
        expect(screen.getByText('선택된 상품의 상품분류가 CoT의 상품분류와 일치하지 않습니다.')).toBeInTheDocument();
      });
    }
  });
});
