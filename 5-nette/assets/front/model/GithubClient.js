export async function getStars(username) {
    const res = await fetch(`https://api.github.com/users/${username}/starred`);

    if (res.status !== 200) {
        const e = new Error();
        e.response = res;
        throw e;
    }

    const json = await res.json();

    return json;
}