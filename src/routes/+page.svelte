<script>
    import UploadFile from "../components/UploadFile.svelte";
    import AnnotationView from "../components/AnnotationView.svelte";

    let fileContent = "";
</script>


<div class="container">
    <UploadFile on:fileUploaded={e => fileContent = e.detail} />
    <AnnotationView fileContent={fileContent} />
</div>
