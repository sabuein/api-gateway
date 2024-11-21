"use strict";

const newEvent = new Event({
    id: "event123",
    title: "JavaScript Mastery Workshop",
    description: "An interactive workshop to learn advanced JavaScript concepts.",
    hostId: "12345",
    location: "Online - Zoom",
    startTime: "2024-11-20T18:00:00Z",
    endTime: "2024-11-20T20:00:00Z",
    eventType: "public",
    maxAttendees: 100
});

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

    static keys(event) {
        const properties = [];
        for (let property in event) properties.push(property);
        return properties;
    }

    static entries(event) {
        const properties = [];
        Object.entries(event).forEach(([key, value]) => properties.push([key, value]));
        return properties;
    }
    
    // Using Intl.NumberFormat for currency formatting (i.e. 123456.78)
    static formatter(amount) {
        const object = new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" });
        return object.format(amount) // £123,456.78
    }
    
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

    // Method: Add attendee
    addAttendee(userId) {
        if (Array.isArray(this.#attendees)) {
            if (!this.#maxAttendees || this.#attendees.length < this.#maxAttendees) {
                this.#attendees.push(userId);
            } else {
                throw new Error("Event is full.");
            }
        }
    }

    // Method: Update RSVP response
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

    // Method: Change event status
    updateStatus(newStatus) {
        if (["upcoming", "ongoing", "completed", "cancelled"].includes(newStatus)) {
            this.#status = newStatus;
        } else {
            throw new Error("Invalid event status.");
        }
    }

    getPrice() {
        return Event.formatter(this.#ticketPrice);
    }

    /*
    Outlook Live:
    https://outlook.live.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=2023-08-09T19:30:00Z&enddt=2023-08-09T22:30:00Z&subject=Birthday&body=With%20clowns%20and%20stuff&location=North%20Pole
    
    Office 365:
    https://outlook.office.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=2023-08-09T19:30:00Z&enddt=2023-08-09T22:30:00Z&subject=Birthday&body=With%20clowns%20and%20stuff&location=North%20Pole
    */

    // Add to Google Calendar
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

    // Download .ics File
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