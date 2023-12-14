<script>
    import UploadFile from "../components/UploadFile.svelte";
    import AnnotationView from "../components/AnnotationView.svelte";
    import FilterFile from "../components/FilterFile.svelte";
    import AnnotationResults from "../components/AnnotationResults.svelte";
	import AnnotationComment from "../components/AnnotationComment.svelte";

    let fileContent = "";
</script>

<div class="mx-10 mt-10 flex gap-10">
    <div class="flex flex-col gap-10 border border-gray-200 rounded-lg p-4">
        <UploadFile on:fileUploaded={e => fileContent = e.detail} />
        <FilterFile />
    </div>
    <div>
        <AnnotationView fileContent={fileContent} />
        <AnnotationComment />
    </div>
    <AnnotationResults />
</div>
