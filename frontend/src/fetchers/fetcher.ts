export async function fetcher<T>(input: string | URL | globalThis.Request, init?: RequestInit): Promise<T> {
    let data;
    try {
        const authHeaderString = localStorage.getItem('authorization-header');
        const authHeader = authHeaderString ? JSON.parse(authHeaderString) : null;

        const headers = {
            ...init?.headers,
            'uid': authHeader.uid || '',
            'client': authHeader.client || '',
            'access-token': authHeader['access-token'] || '',
            'Content-Type' : 'application/json'
        }

        const response = await fetch(input, {...init, headers });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const noContent = response.status === 204;

        if(!noContent) {
            data = await response.json();
        }
    } catch (error) {
        throw new Error(`Response status: ${error}`);
    }

    return data;
}