import { useEffect } from 'react';

const useScript = (url: string, async: boolean = false, onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = async;
        script.onload = onload;

        document.head.appendChild(script);

        return () => { document.head.removeChild(script) }
    }, [url, async, onload]);
};

export default useScript;