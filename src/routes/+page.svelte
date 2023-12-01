<script>
    import UploadFile from "../components/UploadFile.svelte";
    import AnnotationView from "../components/AnnotationView.svelte";
    import FilterFile from "../components/FilterFile.svelte";
    import AnnotationResults from "../components/AnnotationResults.svelte";

    let fileContent = "";
</script>

<div class="mx-10 mt-10 flex gap-10">
    <div class="flex flex-col gap-10">
        <UploadFile on:fileUploaded={e => fileContent = e.detail} />
        <FilterFile />
    </div>
    <div>
        <AnnotationView fileContent={fileContent} />
    </div>
    <AnnotationResults />
</div>
