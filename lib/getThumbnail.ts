 
 export interface ThumbnailData {
    default: {
        url: string;
        width: number;
        height: number;
    };
    medium: {
        url: string;
        width: number;
        height: number;
    };
    high: {
        url: string;
        width: number;
        height: number;
    };
 }

 export const getThumbnail = async (url: string): Promise<{ thumbnail: ThumbnailData | null; error?: string }> => {
    try {
        const response = await fetch(`https://get-thumbnail.vercel.app/get-thumbnail/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (response.ok) {
            const data = await response.json();
            return { thumbnail: data };
        } else {
            return { thumbnail: null, error: 'Failed to fetch thumbnail' };
        }
    } catch (error) {
        console.error('Error in getThamnil:', error);
        return { thumbnail: null, error: 'Network request failed' };
    }
 }