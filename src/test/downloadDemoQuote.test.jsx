import { describe, it, expect, vi } from 'vitest';
import { downloadDemoQuote } from '../utils/downloadDemoQuote';

describe('Demo Quotation Download Utility', () => {
  it('should create a blob link and trigger download of demo quotation file', () => {
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn();
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn();
    }

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/demo-quote');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);

    downloadDemoQuote();

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockAnchor.download).toBe('Nivvan_Jewels_LabGrown_Diamond_Quotation_Catalog_1ct_10ct.html');
    expect(mockAnchor.click).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
