"use strict";

/** @module Event */
/** Class representing an event. */
class Event {

    #id; // Unique event ID
    #title; // Name of the event
    #description; // Detailed information about the event
    #hostId; // User ID of the event's host
    #location; // Physical or virtual location
    #startTime; // Event start time
    #endTime; // Event end time
    #eventType = "public"; // Visibility of the event: "public", "private", "followers"
    #attendees = []; // Array of user IDs attending
    #maxAttendees = null; // Null for unlimited allowed attendees
    #isPinned = false;
    #likes = []; // Array of user IDs who liked the post
    #comments = []; // Array of comment objects
    #shares = 0; // Number of times the post was shared
    #tags = []; // Array of tags or categories
    #createdAt = new Date().toISOString(); // Event creation timestamp
    #updatedAt = null; // Event update timestamp
    #poster = null;
    #media = []; // Array of media URLs (e.g., posters, banners)
    #status = "upcoming"; // Current status of the event: "upcoming", "ongoing", "completed", "cancelled"
    #rsvp = { yes: [], maybe: [], no: [] } // RSVP responses
    #ticketPrice = 0;
    #ticketsSold = 0;
    #recurrence = {
        active: false,
        type: "weekly",
        endAfter: 10
    };

    /**
     * Event keys.
     * @param {Event} event - Event instance.
     * @return {Array} An array contains the event properties.
     */
    static keys(event) {
        const properties = [];
        for (let property in event) properties.push(property);
        return properties;
    }

    /**
     * Event entries.
     * @param {number} event - Event instance.
     * @return {Array} An array contains the event properties.
     */
    static entries(event) {
        const properties = [];
        Object.entries(event).forEach(([key, value]) => properties.push([key, value]));
        return properties;
    }
     
    /**
     * Currency formatter.
     * @param {number} amount - Using Intl.NumberFormat for converting a number into a string (i.e. 123456.78).
     * @return {string} A formated string that represents GBP (i.e. £123,456.78).
     */
    static formatter(amount) {
        const object = new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" });
        return object.format(amount)
    }

    /**
     * Create an event.
     * @param {Object} properties - The properties object that contains keys and values and are required to create an instance of this class.
     * @return {Event} Event instance.
     */
    constructor(properties) {
        // Object.assign(this, properties);
        const {
            title,
            description,
            location,
            startTime,
            endTime,
        } = properties;

        this.#title = title; 
        this.#description = description; 
        this.#location = location; 
        this.#startTime = startTime; 
        this.#endTime = endTime; 
    }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get createdAt() { return this.#createdAt; }
    set createdAt(value) { this.#createdAt = value; }
    get updatedAt() { return this.#updatedAt; }
    set updatedAt(value) { this.#updatedAt = value; }

    /**
     * Add attendee.
     * @param {number} userId - The user ID value.
     * @return {void} Nothing.
     */
    addAttendee(userId) {
        if (Array.isArray(this.#attendees)) {
            if (!this.#maxAttendees || this.#attendees.length < this.#maxAttendees) {
                this.#attendees.push(userId);
            } else {
                throw new Error("Event is full.");
            }
        }
    }

    /**
     * Update RSVP response.
     * @param {number} userId - The attendee user ID value.
     * @param {string} response - The attendee answer value, must be: "yes", "maybe", or "no".
     * @return {void} Nothing.
     */
    updateRSVP(userId, response) {
        if (["yes", "maybe", "no"].includes(response)) {
            for (const key in this.#rsvp) {
                this.#rsvp[key] = this.#rsvp[key].filter(id => id !== userId);
            }
            this.#rsvp[response].push(userId);
        } else {
            throw new Error("Invalid RSVP response.");
        }
    }

    /**
     * Change event status.
     * @param {string} newStatus - The event status value, must be: "upcoming", "ongoing", "completed", or "cancelled".
     * @return {void} Nothing.
     */
    updateStatus(newStatus) {
        if (["upcoming", "ongoing", "completed", "cancelled"].includes(newStatus)) {
            this.#status = newStatus;
        } else {
            throw new Error("Invalid event status.");
        }
    }

    /**
     * Update RSVP response.
     * @return {number} A number representing the ticket price formatted as GBP.
     */
    getPrice() {
        return Event.formatter(this.#ticketPrice);
    }

    /*
    Outlook Live:
    https://outlook.live.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=2023-08-09T19:30:00Z&enddt=2023-08-09T22:30:00Z&subject=Birthday&body=With%20clowns%20and%20stuff&location=North%20Pole
    
    Office 365:
    https://outlook.office.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=2023-08-09T19:30:00Z&enddt=2023-08-09T22:30:00Z&subject=Birthday&body=With%20clowns%20and%20stuff&location=North%20Pole
    */

    /**
     * Add to Google Calendar.
     * @return {string} A string containing a URL representing Google Calendar event.
     */
    generateGoogleCalendarUrl() {
        const baseUrl = "https://calendar.google.com/calendar/render";
        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: this.#title, // Event title
            dates: `${this.#startTime}/${this.#endTime}`, // ISO 8601 format
            details: this.#description, // Event description
            location: this.#location, // Event location
            trp: "false" // Disable reminders by default
        });
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Download .ics File
     * @return {string} A string containing a URL representing a calendar object that can be downloaded with an anchor element.
     */
    generateICS() {
        const prefix = "data:text/calendar;charset=utf-8,";
        const icsContent = `BEGIN:VCALENDAR
        VERSION:2.0
        CALSCALE:GREGORIAN
        BEGIN:VEVENT
        DTSTART:${this.#startTime.replace(/[-:]/g, "")}
        DTEND:${this.#endTime.replace(/[-:]/g, "")}
        SUMMARY:${this.#title}
        DESCRIPTION:${this.#description}
        LOCATION:${this.#location}
        STATUS:CONFIRMED
        END:VEVENT
        END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        return url;
    }
};

export default Event;