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

<div>
    <h2 class="text-xl font-bold mb-5">1. Upload bestand:</h2>
    <div class="flex flex-col items-center justify-center rounded-2xl p-2 mb-4">
        <div>
            <input type="file" class="" on:change={handleFileChange} />
        </div>
    </div>
    <hr/>
</div>

