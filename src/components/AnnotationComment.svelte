<script >
    let selectionStart = 0;
    let selectionEnd = 0;
    let selection = '';
    let showPopup = false;
    let popupX = 0;
    let popupY = 0;
    let additionalComment = '';
  
    // New variables to store selection during input focus
    let inputFocused = false;
    let savedSelection = null;
  
    const comments = [];
  
    // @ts-ignore
    let inputElement;
  
    const handleSelectionChange = () => {
      if (!inputFocused) {
        // Delay processing the selection to allow it to stabilize
        setTimeout(processSelection, 100);
      }
    };
  
    const processSelection = () => {
      // @ts-ignore
      selection = document.getSelection();
  
      if (selection.toString().trim() !== '') {
        // @ts-ignore
        if (selection.rangeCount > 0) {
          // @ts-ignore
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
      console.log("Additional Comment:", additionalComment + " text: " + text );
      const comment = {
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
          // @ts-ignore
          selection.removeAllRanges();
  
          // Add the saved selection range
          // @ts-ignore
          selection.addRange(savedSelection.getRangeAt(0));
        }
      }, 0);
    };
  
    // @ts-ignore
    function highlightMouseEnter(start, end) {
      // @ts-ignore
      const highlightedText = document.querySelector(`span[data-text="${text}"]`);
      if (highlightedText) {
        // @ts-ignore
        highlightedText.style.backgroundColor = "highlighted";
      }
    }
  
  
    function highlightMouseLeave(event) {
      const highlightedText = event.target;
      highlightedText.title = '';
    }
  
    // Helper function to get the comment for a specific text
    // @ts-ignore
    function getCommentForText(text) {
      return comments.find(comment => comment.text === text);
    }
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
  
  <p>
    {#each comments as { start, end, text, additionalComment }}
      {#if text}
        {#if start !== undefined && end !== undefined}
          <span role="button" tabindex="0" style="background-color: yellow; cursor: pointer;" data-text={text} on:mouseenter={() => highlightMouseEnter(start, end)} on:mouseleave={highlightMouseLeave}>
            {#if start === 0 && end === 0}
              {text}
            {:else}
              <span style="background-color: highlighted;">
                {text.slice(0, start)}
                <span style="background-color: yellow;">{text.slice(start, end)}</span>
                {text.slice(end)}
              </span>
            {/if}
          </span>
        {:else}
          {text}
        {/if}
      {/if}
    {/each}
  </p>
  
  
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
  