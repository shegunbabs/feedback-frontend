async function getFeedbacks(url: string) {
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'},
    });

    if (!response.ok) {
        throw new Error(`Error occurred while fetching feedbacks: Status ${response.status}`);
    }

    return response.json();
}

export default getFeedbacks;