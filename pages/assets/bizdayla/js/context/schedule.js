(function() {
    const context = {
        presentation_in_person: [
            {
                name: "Meetup",
                time: "6:30 PM - 9:30 PM",
                presenter: "Various"
            },
            {
                name: "The Home Field Advantage",
                time: "7:30 PM - 8:00 PM",
                presenter: "Various"
            }
        ],
        presentation_virtual: [
            {
                name: "Cyberspace",
                time: "9:00 AM - 5:00 PM",
                presenter: "Various"
            }
        ]
    }

    const template = BizDayLA.templates.schedule(context);
    document.body.innerHTML += template;
})()