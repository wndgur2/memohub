export async function saveMemo(data) {
    //     memo
    // - url: string
    // - text: string
    // - x: int
    // - y: int
    // - color: string
    // - fontSize: int

    try {
        const response = await fetch('/api/memo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                data
            ),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function getMemo() {
    try {
        const response = await fetch('api/memo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}