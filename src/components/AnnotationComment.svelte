<script lang="ts">
    let selectionStart: number = 0;
    let selectionEnd: number = 0;
    let selection: any;
    let showPopup: boolean = false;
    let popupX: number = 0;
    let popupY: number = 0;
    let additionalComment: string = '';
  
    // New variables to store selection during input focus
    let inputFocused: boolean = false;
    let savedSelection: any;
    // TODO able to save the comments into the new data objects.
    const comments :Comment[] = [];
    let inputElement;

    // Temporary interface will use the new data class
    interface Comment {
      start: number,
      end: number,
      text: string,
      additionalComment: string
    }

    const handleSelectionChange = () => {
      if (!inputFocused) {
        // Delay processing the selection to allow it to stabilize
        setTimeout(processSelection, 100);
      }
    };
  
    const processSelection = () => {
      selection = document.getSelection();
  
      if (selection.toString().trim() !== '') {
        if (selection.rangeCount > 0) {
          // TODO fix the getRangeAt error
          const range = selection.getRangeAt(0);
          selectionStart = range.startOffset;
          selectionEnd = range.endOffset;
          const rect = range.getBoundingClientRect();
          popupX = rect.x + window.scrollX;
          popupY = rect.y + rect.height + window.scrollY;
          showPopup = true;
        } else {
          resetSelection();
        }
      } else {
        resetSelection();
      }
    };
  
    const resetSelection = () => {
      selectionStart = 0;
      selectionEnd = 0;
    };
  
    const saveComment = () => {
      // Save the additional comment and selection information
      console.log("Additional Comment:", additionalComment );
      const comment: Comment  = {
        start: selectionStart,
        end: selectionEnd,
        text: selection.toString(),
        additionalComment: additionalComment,
      };
      comments.push(comment);
  
      console.log("Comments:", comments);
  
      // Reset the input after saving the comment
      additionalComment = '';
      closePopup();
  
      // Reset the selection again to ensure consistency
      resetSelection();
    };
  
    const closePopup = () => {
      showPopup = false;
    };
  
    const handleInputFocus = () => {
      inputFocused = true;
  
      // Save the current selection when the input field is focused
      savedSelection = document.getSelection();
    };
  
    const handleInputBlur = () => {
      // Delay the reset of the selection after the input field loses focus
      setTimeout(() => {
        inputFocused = false;
  
        // Restore the selection after the input field loses focus
        if (savedSelection) {
          const selection = document.getSelection();
  
          // Clear the existing range
          selection?.removeAllRanges();
  
          // Add the saved selection range
          selection?.addRange(savedSelection.getRangeAt(0));
        }
      }, 0);
    };
  </script>
  
  <svelte:document on:selectionchange={handleSelectionChange} />
  
  {#if showPopup}
    <div class="card p-4 w-80 shadow-xl"  id="popup-container" style="position: absolute; left: {popupX}px; top: {popupY}px;  border: 1px solid #ccc; padding: 10px;">
      <p>Selected Text: {selection}</p>
      <label class="label p-1">
      <textarea class="textarea p-1 w-full text-surface-200" bind:this={inputElement} bind:value={additionalComment} placeholder="Voer hier uw optionele commenteer toe...." on:focus={handleInputFocus} on:blur={handleInputBlur} />
      </label>
      <button type="button" class="btn variant-glass-primary rounded-full" on:click={saveComment}>Save Comment</button>
      <button type="button" class="btn variant-glass-surface rounded-full" on:click={closePopup}>Close</button>
    </div>
  {/if}