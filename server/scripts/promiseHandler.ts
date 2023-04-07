export default async function handlePromise<T>(promise: Promise<T>): Promise<T[] | (T | null)[]> {
    return await promise.then(data => [null, data])
        .catch(err => [err])
}
