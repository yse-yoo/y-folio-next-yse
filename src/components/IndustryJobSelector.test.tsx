import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IndustryJobSelector from './IndustryJobSelector';

// モック関数
const mockOnSelect = jest.fn();

describe('IndustryJobSelector', () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  test('業界選択が正常に動作する', () => {
    render(<IndustryJobSelector onSelect={mockOnSelect} />);
    
    // IT・テクノロジー業界のボタンが表示される
    const itButton = screen.getByText('IT・テクノロジー');
    expect(itButton).toBeInTheDocument();
    
    // IT業界をクリック
    fireEvent.click(itButton);
    
    // 職種選択セクションが表示される
    expect(screen.getByText('IT・テクノロジーの職種を選択してください')).toBeInTheDocument();
  });

  test('職種選択が正常に動作する', () => {
    render(<IndustryJobSelector onSelect={mockOnSelect} />);
    
    // IT業界を選択
    const itButton = screen.getByText('IT・テクノロジー');
    fireEvent.click(itButton);
    
    // エンジニア職種を選択
    const engineerButton = screen.getByText('エンジニア');
    fireEvent.click(engineerButton);
    
    // 確認ボタンが表示される
    const confirmButton = screen.getByText('この業界・職種で面接を開始');
    expect(confirmButton).toBeInTheDocument();
  });

  test('確認ボタンクリックでonSelectが呼ばれる', () => {
    render(<IndustryJobSelector onSelect={mockOnSelect} />);
    
    // IT業界を選択
    const itButton = screen.getByText('IT・テクノロジー');
    fireEvent.click(itButton);
    
    // エンジニア職種を選択
    const engineerButton = screen.getByText('エンジニア');
    fireEvent.click(engineerButton);
    
    // 確認ボタンをクリック
    const confirmButton = screen.getByText('この業界・職種で面接を開始');
    fireEvent.click(confirmButton);
    
    // onSelectが正しい引数で呼ばれる
    expect(mockOnSelect).toHaveBeenCalledWith('it', 'engineer');
  });

  test('業界変更時に職種選択がリセットされる', () => {
    render(<IndustryJobSelector onSelect={mockOnSelect} />);
    
    // IT業界を選択
    const itButton = screen.getByText('IT・テクノロジー');
    fireEvent.click(itButton);
    
    // エンジニア職種を選択
    const engineerButton = screen.getByText('エンジニア');
    fireEvent.click(engineerButton);
    
    // 金融業界に変更
    const financeButton = screen.getByText('金融・保険');
    fireEvent.click(financeButton);
    
    // 職種選択がリセットされる（確認ボタンが表示されない）
    expect(screen.queryByText('この業界・職種で面接を開始')).not.toBeInTheDocument();
  });

  test('評価基準が正しく表示される', () => {
    render(<IndustryJobSelector onSelect={mockOnSelect} />);
    
    // IT業界を選択
    const itButton = screen.getByText('IT・テクノロジー');
    fireEvent.click(itButton);
    
    // エンジニア職種を選択
    const engineerButton = screen.getByText('エンジニア');
    fireEvent.click(engineerButton);
    
    // 評価基準が表示される
    expect(screen.getByText('40%')).toBeInTheDocument(); // 技術
    expect(screen.getByText('25%')).toBeInTheDocument(); // コミュニケーション
    expect(screen.getByText('20%')).toBeInTheDocument(); // リーダーシップ
    expect(screen.getByText('15%')).toBeInTheDocument(); // 業界知識
  });
});



