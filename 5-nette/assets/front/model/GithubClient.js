export async function getStars(username) {
    return await fetch(`https://api.github.com/users/${username}/starred`)
        .then(r => r.json());
}