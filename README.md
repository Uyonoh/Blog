# Personal Blog
![Home Page](/frontend/public/images/home.jpg)
## Setup
### Backend
1. Create virtual environment
```bash
cd backend
uv venv .venv
```

2. Activate virtual environment
```bash
source .venv/bin/activate
#.venv\Scripts\activate for windows
```

3. Install dependencies
```bash
uv pip install -r requirements.txt
```
4. Make and apply database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Run development server
```bash
python manage.py runserver
```

### Frontend
1. Install dependencies
```bash
cd frontend
npm install
```
2. Run development server
```bash
npm run dev