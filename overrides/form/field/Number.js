/**
 * @class ExtHelpers.overrides.form.field.Number
 * Overrides number field to retain precision.
 *		2 --> 2.0, 2.00, 2.000 and so on...
 *
 * Default behavior converts 2.0 --> 2, 2.00 --> 2, 2.000 --> 2 and so on...
 *
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ExtHelpers.overrides.form.field.Number', {
    override: 'Ext.form.field.Number',
    /**
     * @cfg forcePrecision
     * if true - retains precision else default behavior
     */
    forcePrecision: false,

    /**
     * @method valueToRaw
     * Overridden method to retain precision
     *      0.1 --> 0.100 (if decimal precision set to 3 and so on...)
     * @param {number} value - number field value
     */
    valueToRaw: function (value) {
        var me = this;
        value = me.callParent(arguments);
        return me.forcePrecision ? Ext.Number.toFixed(parseFloat(value), me.decimalPrecision) : value;
    }
});