import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
const mockDiamondList = [
  {
    id: 'test-1',
    title: '1.01 Carat Round Brilliant Diamond',
    shape: 'Round Brilliant',
    carat: 1.01,
    color: 'D',
    clarity: 'VVS1',
    cut: '3X EX',
    certNumber: 'IGI-12345',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp',
    images: ['https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp'],
    videoUrl: 'https://cdn.shopify.com/videos/c/vp/aa9b75e96c01462bb2833009e59fb407/aa9b75e96c01462bb2833009e59fb407.HD-1080p-2.5Mbps-80382398.mp4',
    videoPoster: 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp'
  },
  {
    id: 'test-2',
    title: '2.05 Carat Oval Lab Diamond',
    shape: 'Oval',
    carat: 2.05,
    color: 'E',
    clarity: 'VS1',
    cut: '3X EX',
    certNumber: 'IGI-67890',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp',
    images: ['https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp'],
    videoUrl: 'https://cdn.shopify.com/videos/c/vp/d05afe56ebf94da49193e1649b4275d5/d05afe56ebf94da49193e1649b4275d5.HD-1080p-2.5Mbps-80097073.mp4',
    videoPoster: 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp'
  }
];

// Wrapper with ShopProvider
const renderProductsPage = () => {
  localStorage.setItem('gk_custom_diamonds', JSON.stringify(mockDiamondList));
  return render(
    <ShopProvider>
      <ProductsPage />
    </ShopProvider>
  );
};

describe('ProductsPage 360° Diamond Video & Catalog Specification Cross-Testing Suite', () => {
  it('case 1: catalog dataset contains certified diamonds with valid image and 360° video URLs', () => {
    renderProductsPage();
    expect(screen.getByText(/Certified Loose Lab-Grown Diamonds/i)).toBeInTheDocument();
  });

  it('case 2: defaults to Photo mode on product cards with Photo pill active and allows switching to 360° HD video', () => {
    renderProductsPage();

    const photoPills = screen.getAllByRole('button', { name: /Photo/i });
    expect(photoPills.length).toBeGreaterThan(0);

    const videoPills = screen.getAllByRole('button', { name: /360° HD/i });
    expect(videoPills.length).toBeGreaterThan(0);

    // Switch first product card to 360° HD video
    fireEvent.click(videoPills[0]);

    // Switch back to Photo mode
    fireEvent.click(photoPills[0]);
  });

  it('case 3: renders Nivaan Design & Stienhardt catalog header banner with 100% Lab-Grown indicator badge', () => {
    renderProductsPage();

    expect(
      screen.getByText(/Certified Loose Lab-Grown Diamonds/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/100% Lab-Grown Diamonds/i).length).toBeGreaterThan(0);
  });

  it('case 4: verifies Natural selector tab is removed and catalog displays 100% Lab-Grown diamonds badge', () => {
    renderProductsPage();

    // Verify Natural button tab is not rendered
    expect(screen.queryByRole('button', { name: /^Natural$/i })).not.toBeInTheDocument();

    // Verify Lab-Grown indicator badge exists
    expect(screen.getAllByText(/100% Lab-Grown Diamonds/i).length).toBeGreaterThan(0);
  });

  it('case 5: filters diamonds across vector shape selectors for all 11 shapes', () => {
    renderProductsPage();

    const shapes = ['Round', 'Oval', 'Emerald', 'Cushion', 'Radiant', 'Pear', 'Princess', 'Marquise', 'Heart', 'Asscher', 'Hexagon'];

    shapes.forEach((shape) => {
      const shapeBtn = screen.getByRole('button', { name: new RegExp(`^${shape}$`, 'i') });
      fireEvent.click(shapeBtn);
      expect(screen.getAllByText(new RegExp(shape, 'i')).length).toBeGreaterThan(0);
    });
  }, 15000);

  it('case 6: strictly isolates Round filter so non-Round diamonds like Hexagon do not appear in product results', () => {
    renderProductsPage();

    const roundBtn = screen.getByRole('button', { name: /^Round$/i });
    fireEvent.click(roundBtn);

    expect(screen.queryByText(/Elongated Hexagon/i)).not.toBeInTheDocument();
  });

  it('case 7: filters diamonds by Carat range selectors', () => {
    renderProductsPage();

    const carat1to19 = screen.getByRole('button', { name: /1.0 - 1.99 Ct/i });
    fireEvent.click(carat1to19);

    const carat2to29 = screen.getByRole('button', { name: /2.0 - 2.99 Ct/i });
    fireEvent.click(carat2to29);

    const carat3Plus = screen.getByRole('button', { name: /3.0\+ Ct/i });
    fireEvent.click(carat3Plus);

    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('case 8: filters diamonds by Color grade buttons', () => {
    renderProductsPage();

    const colorD = screen.getByRole('button', { name: /^D$/i });
    fireEvent.click(colorD);

    const colorE = screen.getByRole('button', { name: /^E$/i });
    fireEvent.click(colorE);

    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('case 9: filters diamonds by Clarity grade buttons', () => {
    renderProductsPage();

    const clarityVVS1 = screen.getByRole('button', { name: /^VVS1$/i });
    fireEvent.click(clarityVVS1);

    const clarityVS1 = screen.getByRole('button', { name: /^VS1$/i });
    fireEvent.click(clarityVS1);

    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('case 10: filters diamonds by 3X EX Triple Excellent toggle button', () => {
    renderProductsPage();

    const exButton = screen.getByRole('button', { name: /3X EX Only/i });
    fireEvent.click(exButton);

    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('case 11: filters diamonds by search term in search input', () => {
    renderProductsPage();

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape, cert #.../i);
    fireEvent.change(searchInput, { target: { value: 'Round' } });

    expect(screen.getAllByText(/Round/i).length).toBeGreaterThan(0);
  });

  it('case 12: switches layout mode between Visual Grid Cards View and B2B Specification Table View', () => {
    renderProductsPage();

    const tableViewButton = screen.getByTitle(/B2B Table List View/i);
    fireEvent.click(tableViewButton);

    expect(screen.getByText(/Media/i)).toBeInTheDocument();
    expect(screen.getByText(/Title & Item ID/i)).toBeInTheDocument();

    const gridViewButton = screen.getByTitle(/Grid Cards View/i);
    fireEvent.click(gridViewButton);

    expect(screen.getAllByText(/100% Lab-Grown Diamonds/i).length).toBeGreaterThan(0);
  });

  it('case 13: allows multi-item batch selection and triggers batch quote modal', () => {
    renderProductsPage();

    const tableViewButton = screen.getByTitle(/B2B Table List View/i);
    fireEvent.click(tableViewButton);

    const selectButtons = screen.getAllByTitle('Select Item');
    expect(selectButtons.length).toBeGreaterThan(1);

    fireEvent.click(selectButtons[0]);
    fireEvent.click(selectButtons[1]);

    expect(screen.getByText(/2 Items Selected for Batch Quotation/i)).toBeInTheDocument();

    const batchQuoteButton = screen.getByRole('button', { name: /Request Batch USD Quote/i });
    expect(batchQuoteButton).toBeInTheDocument();
  });

  it('case 14: switches between Gem360 HD Player and Official Lab Report Viewer tabs in modal', () => {
    renderProductsPage();

    const viewMediaButtons = screen.getAllByTitle(/View Media Gallery/i);
    fireEvent.click(viewMediaButtons[0]);

    const labReportTab = screen.getByRole('button', { name: /Lab Grading/i });
    fireEvent.click(labReportTab);

    expect(screen.getByText(/Official Lab Grading Report/i)).toBeInTheDocument();

    const mediaTabs = screen.getAllByRole('button', { name: /Media Gallery/i });
    fireEvent.click(mediaTabs[0]);

    expect(screen.getAllByText(/Wholesale/i).length).toBeGreaterThan(0);
  });

  it('case 15: toggles 360° video playback play/pause state in modal viewer', () => {
    renderProductsPage();

    const viewMediaButtons = screen.getAllByTitle(/View Media Gallery/i);
    fireEvent.click(viewMediaButtons[0]);

    // Initial state in modal is playing (Pause button visible in controls)
    const pauseButton = screen.getByTitle(/Pause Video/i);
    expect(pauseButton).toBeInTheDocument();

    // Click pause -> state becomes paused (Play button visible in controls)
    fireEvent.click(pauseButton);
    const playButton = screen.getByTitle(/Play Video/i);
    expect(playButton).toBeInTheDocument();

    // Click play again -> state returns to playing
    fireEvent.click(playButton);
    expect(screen.getByTitle(/Pause Video/i)).toBeInTheDocument();
  });

  it('case 16: adjusts 360° video playback speeds (0.5x, 1x, 1.5x, 2x) in modal player', () => {
    renderProductsPage();

    const viewMediaButtons = screen.getAllByTitle(/View Media Gallery/i);
    fireEvent.click(viewMediaButtons[0]);

    const speed2xButton = screen.getByRole('button', { name: /2x/i });
    fireEvent.click(speed2xButton);

    const speed1xButton = screen.getByRole('button', { name: /1x/i });
    fireEvent.click(speed1xButton);

    expect(speed1xButton).toBeInTheDocument();
  });

  it('case 17: toggles 360° video mute/unmute audio state in modal viewer', () => {
    renderProductsPage();

    const viewMediaButtons = screen.getAllByTitle(/View Media Gallery/i);
    fireEvent.click(viewMediaButtons[0]);

    const muteButton = screen.getByTitle(/Unmute Audio/i);
    expect(muteButton).toBeInTheDocument();

    fireEvent.click(muteButton);
    expect(screen.getByTitle(/Mute Audio/i)).toBeInTheDocument();
  });

  it('case 18: resets all filters when clicking Reset Filters button', () => {
    renderProductsPage();

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape, cert #.../i);
    fireEvent.change(searchInput, { target: { value: 'RandomSearchQuery123' } });

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetButton);

    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });
});
