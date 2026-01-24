import * as ReactRouterDOMTypes from 'react-router-dom';

const ReactRouterDOM = (window as any).ReactRouterDOM as typeof ReactRouterDOMTypes;

export default ReactRouterDOM;
export const {
    Link,
    NavLink,
    Navigate,
    Outlet,
    Route,
    Routes,
    useHref,
    useInRouterContext,
    useLocation,
    useMatch,
    useNavigate,
    useNavigationType,
    useOutlet,
    useOutletContext,
    useParams,
    useResolvedPath,
    useRoutes,
    useSearchParams,
    createBrowserRouter,
    createHashRouter,
    createMemoryRouter,
    RouterProvider
} = ReactRouterDOM;
