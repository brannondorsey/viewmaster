#Viewmaster Narrative Companion

A companion command line application for use with physical Viewmaster reels.

A user inserts reels into their Viewmaster and then uses the Viewmaster Narrative Companion on their computer's terminal to create and edit fictional histories of the images they are viewing. The Narrative companion acts as a wiki style authorial narrative database for adding contextual and imaginative language to 3D Viewmaster travel images of the past.

##Commands

- `help`
- `using <reelNumber>`
- `next`
- `go to <imageNumber>`
- `get description`
- `get history`
- `get event list`
- `get event [name]`
- `get item list`
- `get <item> description`
- `get <item> notes`
- `add description`
- `add event`
- `add item`
- `add <item> note`

__Future commands__

- `get map`


##Usage

`help`: prints a list of all commands and descriptions of their usage

`using <reelNumber>`: specifies the reel ID number using `<realNumber>`

`next`: notifies the program that you have advanced the reel once

`go to <imageNumber>`: notifies the program that you are viewing the image at `<imageNumber>`

`get description`: shows you the current description of the location that you are viewing

`get history`: displays all of the events associated with the location that you are viewing in chronological order

`get event list`: prints a list of all event names

`get event [name]`: prints the event that matches `[name]` if it was provided or a random event if it was not

`get item list`: prints a list of all item names

`get <item> description`: prints a the description of `<item>`

`get <item> notes`: prints all of the notes associated with the `<item>`

`add description`: add or overwrite the location's description

`add event`: adds an event to the location

`add item`: adds an item to the location

`add <item> note`: adds a new note to the `<item>`

