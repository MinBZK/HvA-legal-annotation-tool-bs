<script>
    import "../app.css";
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
    import { Toast, storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
    import { initializeStores } from '@skeletonlabs/skeleton';

    initializeStores();
</script>
<Toast/>
<slot />