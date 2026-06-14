// Site configuration
export const siteConfig = {
    name: "The Band Company",
    description: "Premium live music and entertainment for weddings, corporate events, and private parties",
    // Update this URL when you deploy your site
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://thebandcompany.com",
    phone: "7779945379",
    whatsapp: {
        number: "7779945379",
        defaultMessage: "Hi! I'm interested in booking The Band Company for my event."
    },
    social: {
        facebook: "https://facebook.com/thebandcompany",
        instagram: "https://instagram.com/thebandcompany",
        twitter: "https://twitter.com/thebandcompany",
        youtube: "https://youtube.com/@thebandcompany"
    }
};
