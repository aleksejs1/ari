const ReactQuery = (window as any).ReactQuery;

export default ReactQuery;
export const {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
    useIsFetching,
    useIsMutating
} = ReactQuery;
