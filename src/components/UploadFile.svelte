<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
        if (file && file.type === "text/xml") {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const fileContent = e.target.result as string;
                    localStorage.setItem("uploadedXML", fileContent);
                    dispatch("fileUploaded", fileContent);
                }
            };
            reader.readAsText(file);
        } else {
            alert("AUB alleen een .xml bestand uploaden.");
        }
    }
</script>

<div class="my-10">
    <input type="file" accept=".xml" on:change={handleFileChange} />
</div>

