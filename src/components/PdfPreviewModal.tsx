'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Printer, X } from 'lucide-react';
import StandardPdfContent from '@/components/preview/StandardPdfContent';
import TablePdfContent from '@/components/preview/TablePdfContent';
import ResumePdfContent from '@/components/preview/ResumePdfContent';
import CareerPdfContent from '@/components/preview/CareerPdfContent';
import { fetchPortfolioPdfData } from '@/lib/api/portfolio';
import { PortfolioPdfData } from '@/types/PortfolioPdf';
import { generatePortfolioDocx } from '@/lib/word/portfolioDocx';

const MM_PER_INCH = 25.4;
const SCREEN_DPI = 96;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = Math.round((A4_WIDTH_MM / MM_PER_INCH) * SCREEN_DPI); // ≈ 794px
const A4_HEIGHT_PX = Math.round((A4_HEIGHT_MM / MM_PER_INCH) * SCREEN_DPI); // ≈ 1123px


interface Props {
    pdfFormat: 'standard' | 'table' | 'resume' | 'career';
    setPdfFormat: (format: 'standard' | 'table' | 'resume' | 'career') => void;
    userId: string;
    close: () => void;
    onPrint: () => void;
    onDownload?: () => void;
}

export default function PdfPreviewModal({
    pdfFormat,
    setPdfFormat,
    userId,
    close,
    onPrint,
    onDownload
}: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [portfolioData, setPortfolioData] = useState<PortfolioPdfData | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isOpeningSeparateView, setIsOpeningSeparateView] = useState(false);
    const hasPortfolio = Boolean(portfolioData?.portfolio);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleFormatChange = (newFormat: 'standard' | 'table' | 'resume' | 'career') => {
        setPdfFormat(newFormat);
    };

    const handleDownload = async () => {
        if (isLoading || isDownloading) return;
        if (!portfolioData || !portfolioData.portfolio) {
            alert('ダウンロード対象のポートフォリオ情報が見つかりませんでした');
            return;
        }

        setIsDownloading(true);

        try {
            const blob = await generatePortfolioDocx(portfolioData, pdfFormat);
            const fileSaverModule = await import('file-saver');
            const saveAs = (
                (fileSaverModule.default as ((file: Blob, filename: string) => void) | undefined) ??
                (fileSaverModule as { saveAs?: (file: Blob, filename: string) => void }).saveAs
            );

            if (!saveAs) {
                throw new Error('saveAs 関数を読み込めませんでした');
            }

            saveAs(blob, 'portfolio.docx');
            onDownload?.();
        } catch (downloadError) {
            console.error('Word download failed:', downloadError);
            alert('Wordファイルのダウンロードに失敗しました');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleOpenInNewTab = () => {
        if (isLoading || !previewRef.current || isOpeningSeparateView) return;

        setIsOpeningSeparateView(true);

        try {
            const previewElement = previewRef.current;
            const newWindow = window.open('', '_blank', 'noopener=yes');

            if (!newWindow) {
                alert('新しいタブを開けませんでした。ブラウザのポップアップ設定を確認してください。');
                return;
            }

            const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                .map((node) => node.outerHTML)
                .join('\n');

            const customStyles = `
                <style>
                    body {
                        margin: 0;
                        padding: 32px;
                        background: #f3f4f6;
                        font-family: sans-serif;
                        display: flex;
                        justify-content: center;
                    }
                    .preview-container {
                        background: #ffffff;
                        box-shadow: 0 20px 45px rgba(30, 41, 59, 0.15);
                        border-radius: 12px;
                        overflow: hidden;
                    }
                </style>
            `;

            const html = `<!DOCTYPE html>
                <html lang="ja">
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        ${styleSheets}
                        ${customStyles}
                        <title>PDFプレビュー</title>
                    </head>
                    <body>
                        <div class="preview-container">
                            ${previewElement.outerHTML}
                        </div>
                    </body>
                </html>`;

            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        } finally {
            setIsOpeningSeparateView(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            setPortfolioData(null);
            setIsLoading(false);
            setError('ユーザーIDが見つかりません');
            return;
        }

        let isActive = true;

        const load = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchPortfolioPdfData(userId);
                if (!isActive) return;
                setPortfolioData(data);
            } catch (err) {
                if (!isActive) return;
                const message = err instanceof Error ? err.message : 'ポートフォリオ情報の取得に失敗しました';
                setError(message);
                setPortfolioData(null);
            } finally {
                if (!isActive) return;
                setIsLoading(false);
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [userId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">PDFプレビュー</h3>
                        <p className="text-sm text-gray-600">印刷用ポートフォリオのプレビュー</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 mr-4">
                            <label className="text-sm font-medium text-gray-700">形式:</label>
                            <select
                                value={pdfFormat}
                                onChange={(e) => handleFormatChange(e.target.value as 'standard' | 'table' | 'resume' | 'career')}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={isLoading}
                            >
                                <option value="standard">標準形式</option>
                                <option value="table">表形式</option>
                                <option value="resume">履歴書形式</option>
                                <option value="career">職務経歴書形式</option>
                            </select>
                        </div>
                        <button
                            onClick={handleOpenInNewTab}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            disabled={isLoading || isOpeningSeparateView}
                        >
                            <ExternalLink className={`w-5 h-5 ${isOpeningSeparateView ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                            onClick={onPrint}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            disabled={isLoading}
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            disabled={isLoading || isDownloading}
                        >
                            <Download className={`w-5 h-5 ${isDownloading ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                            onClick={close}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-600 p-4 text-center">{error}</div>
                    ) : !portfolioData || !hasPortfolio ? (
                        <div className="text-gray-500 p-4 text-center">ポートフォリオ情報が見つかりませんでした。</div>
                    ) : (
                        <div
                            ref={previewRef}
                            id="pdf-preview"
                            className="mx-auto bg-white text-gray-900 shadow-sm"
                            style={{
                                width: `${A4_WIDTH_PX}px`,
                                minHeight: `${A4_HEIGHT_PX}px`,
                                padding: '48px',
                                boxSizing: 'border-box',
                            }}
                        >
                            {pdfFormat === 'standard' && <StandardPdfContent data={portfolioData} />}
                            {pdfFormat === 'table' && <TablePdfContent data={portfolioData} />}
                            {pdfFormat === 'resume' && <ResumePdfContent data={portfolioData} />}
                            {pdfFormat === 'career' && <CareerPdfContent data={portfolioData} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}