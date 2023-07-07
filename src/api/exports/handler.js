const autoBind = require('auto-bind');

class ExportsHandler {
    constructor(producerService, playlistService, validator) {
        this._producerService = producerService;
        this._playlistService = playlistService;
        this._validator = validator;

        autoBind(this);
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

        const { targetEmail } = request.payload;
        const message = { playlistId, targetEmail };
        await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

        return h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
        }).code(201);
    }

}
module.exports = ExportsHandler;
