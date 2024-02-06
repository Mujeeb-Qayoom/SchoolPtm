const axios = require('axios');

module.exports = {

    createZoomMeeting: async (createZoomMeetingDto, accessToken) => {
        try {
            const response = await axios.post("https://api.zoom.us/v2/users/me/meetings", createZoomMeetingDto, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error creating Zoom meeting:', error.message);
            throw error;
        }
    },

    getZoomMeetingById: async (meetingId, accessToken) => {
        try {
            const response = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.error(`Failed to retrieve meeting. Status code: ${error.response ? error.response.status : 'Unknown'}`);
            throw error;
        }
    },

    getZoomAccessToken: async () => {
        try {
            const clientIdAndSecret = `${"VCC05FX2RtWQUwGYQjNV8A"}:${"tC0Yj9A7bCDUonhIXX8mZwIfc2mHxJA1"}`;
            console.log(clientIdAndSecret);

            const base64Credentials = Buffer.from(clientIdAndSecret).toString('base64');
            console.log('Base64 Credentials:', base64Credentials);


            const response = await axios.post(
                `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${"H9BemT72SO2LxS0D2Z6RWQ"}`,
                null,
                {
                    headers: {
                        Authorization: `Basic ${base64Credentials}`
                    }
                }
            );
            console.log('Token Response:', response.data);

            return response.data.access_token;
        } catch (error) {
            console.error('Error getting Zoom access token:', error.message);
            throw error;
        }
    },
}


