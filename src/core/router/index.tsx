import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/shared/components/layouts/MainLayout';
import DashboardPage from '@/modules/dashboard/DashboardPage';
import IndicationListingPage from '@/modules/indication/IndicationListingPage';
import CompaniesPage from '@/modules/companies/CompaniesPage';
import SegmentationPage from '@/modules/segmentation/SegmentationPage';
import TourismPage from '@/modules/tourism/TourismPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, handle: { breadcrumb: 'menu.dashboard' }, element: <DashboardPage /> },
      { path: 'indicacao-geografica', handle: { breadcrumb: 'menu.indication' }, element: <IndicationListingPage /> },
      { path: 'empresas', handle: { breadcrumb: 'menu.companies' }, element: <CompaniesPage /> },
      { path: 'segmentacao-de-loja', handle: { breadcrumb: 'menu.segmentation' }, element: <SegmentationPage /> },
      { path: 'turismo', handle: { breadcrumb: 'menu.tourism' }, element: <TourismPage /> }
    ]
  }
]);
