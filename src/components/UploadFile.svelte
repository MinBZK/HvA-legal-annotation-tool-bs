<script lang="ts">
    import { createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    async function handleFileChange(event: any) {
        const file = event.target.files[0];
        if (file && file.type === "text/xml") {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const fileContent = e.target.result;
                localStorage.setItem("uploadedXML", fileContent);
                dispatch("fileUploaded", e.target.result);
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid XML file.");
        }
    }
</script>

<input type="file" accept=".xml" on:change={handleFileChange} />
