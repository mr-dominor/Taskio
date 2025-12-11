import {createApi} from "unsplash-js"

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!;

if (!accessKey) {
  throw new Error("Missing Unsplash access key. Add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to .env.local");
}

export const unsplash = createApi({
    accessKey,
    fetch:fetch
});  