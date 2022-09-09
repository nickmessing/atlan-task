type PromiseWithProgress<T> = Promise<T> & {
  onProgressChange: (cb: (progress: number) => void) => void
  setProgress: (progress: number) => void
}

export const promiseWIthProgress = <T, Args extends any[]>(
  fn: (setProgress: (progress: number) => void, ...args: Args) => Promise<T>,
): ((...args: Args) => PromiseWithProgress<T>) => {
  const promise = (...args: Args) => {
    let progress = 0
    const progressCallbacks: ((progress: number) => void)[] = []
    const setProgress = (newProgress: number) => {
      progress = newProgress
      progressCallbacks.forEach(cb => cb(progress))
    }
    const promise = fn(setProgress, ...args)
    const promiseWithProgress = promise as PromiseWithProgress<T>
    promiseWithProgress.onProgressChange = cb => progressCallbacks.push(cb)
    promiseWithProgress.setProgress = setProgress
    return promiseWithProgress
  }
  return promise
}
