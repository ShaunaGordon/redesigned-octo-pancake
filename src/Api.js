/**
 * Notes: In a larger application, this might get split into a folder and each API have its own file, with this becoming Api->AddressValidator or something. However, at this point, going that full way is overkill and violates YAGNI. However, we can strike a reasonable balance, and do things like not hardcode the base URL in the code itself and encapsulate the service-specific things, allowing us the ability to drop in a delegation class, should the need arise.
 */

// Move to .env?
const baseUrl = `https://api.address-validator.net/api/verify?APIKey=${process.env.ADDRESS_KEY}`;

const Api = {
    send: (data) => {
        // Gather data
        // Format it to API's format
        // Send to API
        // Return response from API
    }
}

export default Api;
