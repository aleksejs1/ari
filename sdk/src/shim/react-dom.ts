const ReactDOM = (window as any).ReactDOM;

export default ReactDOM;
export const {
    createPortal,
    findDOMNode,
    unmountComponentAtNode,
    unstable_batchedUpdates,
    flushSync
} = ReactDOM;
