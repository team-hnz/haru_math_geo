import { useEffect } from 'react';

const useLink = (href: string, rel: string, type: string) => {
    useEffect(() => {
        const link = document.createElement('link');

        link.href = href;
        link.rel = rel;
        link.type = type;

        document.head.appendChild(link);

        return () => { document.head.removeChild(link) }
    }, [href, rel, type]);
};

export default useLink;