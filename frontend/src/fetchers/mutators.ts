export async function mutator<T>(url: string, { arg }: { arg: T }) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });

    if(!response.ok) {
        throw new Error(`Failed to mutate on ${url}`);
    }

    const data = await response.json();

    const authHeaders = {
      client: response.headers.get('client'),
      uid: response.headers.get('uid'),
      token: response.headers.get('access-token')
    };

    return {
      data,
      authHeaders
    };
}