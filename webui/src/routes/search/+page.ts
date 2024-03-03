// since there's no dynamic data here, we can prerender
import vagrantrepo from "$lib/common/repo";

// it so that it gets served as a static asset in production
export async function load({ params }:any) {
    const boxes = await vagrantrepo.search(params.q);

    return {
        boxes
    };
}