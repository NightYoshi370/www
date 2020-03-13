/*global game,me*/

game.enemy = game.enemy || {};

game.enemy.bouncy = game.enemy.bouncy || {};

game.enemy.bouncy.type = {
	HORIZONTAL : "horizontal",
	VERTICAL   : "vertical",
	BOTH       : "both"
};

/**
 * Walks through an axis (vertical, horizontal or both)
 * bouncing on every tile on the map that's solid.
 */
game.enemy.bouncy.entity = game.enemy.entity.extend({

	/**
	 * Creates the enemy.
	 *
	 * @param settings Hash of options defined on Tiled.
	 *
	 * @note You MUST specify a type for this enemy.
	 *       It can be "horizontal", "vertical" or "both".
	 */
	init : function (x, y, settings) {

		// Defaulting to horizontal enemy
		this.walkType = settings.type || game.enemy.bouncy.type.HORIZONTAL;

		this._super(game.enemy.entity, 'init', [x, y, settings]);

		this.walkLeft = true;
		this.walkUp   = true;

		this.body.setVelocity(0.12, 0.12);

		// THIS IS A "BUG" ON MELONJS
		// Since the player is 2 pixels large, it's
		// collision box actually is 3 pixels large!
		// Don't know why but I have to adjust it
		// manually here.
		if (this.walkType === game.enemy.bouncy.type.HORIZONTAL) {
			var shape = this.body.getShape();
			shape.bounds.width--;
		}
	},

	update : function (delta) {
		// Do nothing if not on the screen
		if (! this.inViewport)
			return false;

		if (this.alive) {
			if (this.walkType !== game.enemy.bouncy.type.HORIZONTAL) {
				// This is either VERTICAL or BOTH

				this.body.vel.y += ((this.walkUp) ?
						       -this.body.accel.y :
						       this.body.accel.y) * me.timer.tick;

			}
			if (this.walkType !== game.enemy.bouncy.type.VERTICAL) {
				// This is either HORIZONTAL or BOTH

				this.body.vel.x += ((this.walkLeft) ?
						       -this.body.accel.x :
						       this.body.accel.x) * me.timer.tick;
			}
		} else {
			this.body.vel.x = this.body.vel.y = 0;
		}

		// melonJS internal callback
		var collision = this.body.update();

		// Collided vertically!
		if (collision.y != 0 && this.walkType === game.enemy.bouncy.type.VERTICAL)
			this.walkUp = (! this.walkUp);

		// Collided horizontally
		if (collision.x != 0 && this.walkType === game.enemy.bouncy.type.HORIZONTAL)
			this.walkLeft = (! this.walkLeft);

		this._super(game.enemy.entity, 'update', [delta]);
		return true;
	}
});

