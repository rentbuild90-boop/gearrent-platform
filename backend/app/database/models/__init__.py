# Import all models to ensure they are registered with SQLAlchemy's metadata
from app.database.models.auth import *
from app.database.models.profile import *
from app.database.models.owner import *
from app.database.models.driver import *
from app.database.models.master import *
from app.database.models.equipment import *
from app.database.models.payment import *
from app.database.models.booking import *
from app.database.models.tracking import *
from app.database.models.chat import *
from app.database.models.notification import *
from app.database.models.review import *
from app.database.models.admin import *
from app.database.models.developer import *
from app.database.models.system_account import *
from app.database.models.passkey import *
from app.database.models.pin import *
