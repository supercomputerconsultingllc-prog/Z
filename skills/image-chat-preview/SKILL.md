---
name: image-chat-preview
description: Show local images directly in chat by reading image files so the client can render them as attachments. Use when the user asks to display, show, preview, inspect, or surface an image from the workspace, browser capture output, or another local path in the conversation itself, especially after screenshots or other image-generating commands.
---

# Image Chat Preview

Display local image files in the chat by reading the image file path directly.

## Core rule

When the user asks to **show** or **display** an image in chat, use the image-capable file reader on the actual image path instead of only pasting a filesystem path into text.

## Workflow

1. Identify the target image path.
2. If the path is missing or ambiguous, resolve it first.
3. Read the image file directly.
4. Then send a short confirmation or caption in the reply.

## Common sources

- Workspace images like `workspace/reports/*.png`
- Browser captures under `~/.openclaw/media/browser/`
- Explicit absolute paths from prior tool output

## Browser screenshot pattern

If a browser command returned something like:

```text
MEDIA:~/.openclaw/media/browser/abc123.jpg
```

Normalize it to an absolute path and read that image file.

## Use the helper script when needed

Run `scripts/find_recent_image.py` when the user wants:

- the latest screenshot
- the newest image in a folder
- help locating a recent browser capture

Example:

```bash
python3 skills/image-chat-preview/scripts/find_recent_image.py --browser-latest
```

or

```bash
python3 skills/image-chat-preview/scripts/find_recent_image.py /home/ai/.openclaw/workspace/reports
```

The script prints JSON describing the latest image path.

## Guardrails

- Do not claim an image was shown unless the image file was actually read successfully.
- If the file does not exist, say that plainly.
- If multiple candidate images exist, prefer the most recent one or ask which image the user wants.
- Keep the text reply short; the image is the main payload.
