module.exports = {

	/**
	 * Instructions on how to get this: https://redd.it/40zgse
	 */
	yourID: "303211762923077635",

	setupCMD: "erole",

	/**
	 * Delete the 'setupCMD' command after it is ran. Set to 'true' for the command message to be deleted
	 */
	deleteSetupCMD: false,

	initialMessage: `**Wciśnij emotki na dole!**`,
	
	embedMessage: `
	Aby zobaczyć kanały musisz mieć jakąkolwiek rolę.
	Dodaj emotkę aby otrzymać odpowiadającą jej rolę.
	Aby usunąć tą rolę poprostu usuń emotkę. Chcesz inną rolę? Napisz do moderatora.
	`,
	
	/**
	 * Must set this if "embed" is set to true
	 */
	embedFooter: "KXNBot",
	
	roles: ["Zweryfikowany","Widz", "CSGO", "F1/SimRacing", "FIFA", "LOL", "Fortnite"],

	/**
	 * For custom emojis, provide the name of the emoji
	 */
	reactions: ["✅","💻", "csgo", "f1", "fifa", "lol", "fortnite"],

	/**
	 * Set to "true" if you want all roles to be in a single embed
	 */
	embed: true,

	/**
	 * Set the embed color if the "embed" variable is et to "true"
	 * Format:
	 * 
	 * #dd9323
	 */
	embedColor: "#dd9323",

	/**
	 * Set to "true" if you want to set a thumbnail in the embed
	 */
	embedThumbnail: false,

	/**
	 * The link for the embed thumbnail if "embedThumbnail" is set to true
	 */
	embedThumbnailLink: "",


};