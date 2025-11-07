module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define(
        "ChatMessage",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            message: { type: DataTypes.TEXT, allowNull: false },
        },
        {
            tableName: "chat_messages",
            timestamps: true, // includes createdAt
        }
    );

    return ChatMessage;
};
