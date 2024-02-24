"""empty message

Revision ID: 333c0d53cb46
Revises: cba46f7a42c0
Create Date: 2024-02-24 11:51:22.855105

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '333c0d53cb46'
down_revision = 'cba46f7a42c0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('firstName', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('lastName', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('birthDate', sa.Date(), nullable=False))
        batch_op.add_column(sa.Column('country', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('username', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('password_hash', sa.String(length=80), nullable=False))
        batch_op.create_unique_constraint(None, ['username'])
        batch_op.drop_column('password')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('password_hash')
        batch_op.drop_column('username')
        batch_op.drop_column('country')
        batch_op.drop_column('birthDate')
        batch_op.drop_column('lastName')
        batch_op.drop_column('firstName')

    # ### end Alembic commands ###