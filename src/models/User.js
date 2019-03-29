function summarize(item) {
    return {
        'email': item.Email.S,
        'name': item.Name.S,
        'description': item.Description.S,
        'skills': item.Skills.S,
        'facebook': item.Facebook.S,
        'linkedin': item.Linkedin.S
    };
}

module.exports.summarize = summarize;