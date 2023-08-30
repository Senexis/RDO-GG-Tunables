import { formatters } from 'jsondiffpatch/dist/jsondiffpatch.umd.slim.js';

// This is a custom formatter that extends the default HTML formatter. It adds
// the ability to show unchanged arrays and objects in the diff just like any
// other node. This allows users to browser the diff in a more consistent way.
class ExtendedHtmlFormatter extends formatters.html.default {
  format_unchanged(context, delta, left) {
    // If the node is not an array or object, then use the default formatter.
    if (typeof left !== 'object') {
      return super.format_unchanged(context, delta, left);
    }

    // Get the type of the node.
    const type = Array.isArray(left) ? 'array' : 'object';

    // Add the value wrapper.
    context.out('<div class="jsondiffpatch-value">');

    // Set the nearest node to be a typed parent node.
    const nodeIndex = context.buffer.length - 2;
    context.buffer[nodeIndex] = context.buffer[nodeIndex].replace(
      'jsondiffpatch-unchanged',
      `jsondiffpatch-node jsondiffpatch-child-node-type-${type}`
    );

    // Set the nearest value to be a typed node.
    const valueIndex = context.buffer.length - 1;
    context.buffer[valueIndex] = context.buffer[valueIndex].replace(
      'jsondiffpatch-value',
      `jsondiffpatch-node jsondiffpatch-node-type-${type}`
    );

    // Add the node wrapper.
    context.out(`<ul class="jsondiffpatch-node jsondiffpatch-node-type-${type}">`);

    // Add each of the values to the node.
    for (const [index, line] of Object.entries(left)) {
      // If the line is an array or object, we need to recurse.
      if (typeof line === 'object') {
        // Just like above, get the type of the node.
        const lineType = Array.isArray(line) ? 'array' : 'object';

        // Since we are recursing, we need to add a new node.
        this.nodeBegin(context, null, index, 'unchanged', typeof lineType);

        // Run this code again.
        this.format_unchanged(context, delta, line);

        // Close the newly added node.
        this.nodeEnd(context);

        // Don't add the value as a node.
        continue;
      }

      // Add the node with the change type.
      this.nodeBegin(context, null, index, 'unchanged', typeof line);

      // Add the value.
      context.out('<div class="jsondiffpatch-value">');

      // Format and display the value.
      this.formatValue(context, line);

      // Close the value.
      context.out('</div>');

      // Close the node.
      this.nodeEnd(context);
    }

    // Close the node.
    context.out('</ul>');

    // Close the value.
    context.out('</div>');
  }
}

export const showUnchanged = formatters.html.showUnchanged;

export const hideUnchanged = formatters.html.hideUnchanged;

export default ExtendedHtmlFormatter;

let defaultInstance;

export function format(delta, left) {
  if (!defaultInstance) {
    defaultInstance = new ExtendedHtmlFormatter();
  }

  return defaultInstance.format(delta, left);
}
