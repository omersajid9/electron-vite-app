async function getFromClipboard(setCopy: (text: string) => void ) {
    try {
      const text = await navigator.clipboard.readText();
      setCopy(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      return null;
    }
  }

export default getFromClipboard;