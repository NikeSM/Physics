#-*- coding: utf8 -*-
import flask
from flask import Flask
from flask import request, jsonify, render_template, json, send_from_directory
import os
import datetime
import MySQLdb
import re
from flask import make_response

#db = MySQLdb.connect(host = "mysql88.1gb.ru", user = "gb_physicsdev", passwd = "b24603455rt", db = "gb_physicsdev", charset = 'utf8')
db = MySQLdb.connect(host = "mysql88.1gb.ru", user = "gb_x_123ph03a", passwd = "32eb8237756", db = "gb_x_123ph03a", charset = 'utf8')
cursor = db.cursor()
root = r"/home/virtwww/w_123physics-ru_7f500369/http/Physics"
#root = r"/home/virtwww/w_123physics-ru_7f500369/http/dev/dev"
#root = r"."

editor = r"edit"
base = r"base" 

app = Flask(__name__, static_folder = root + r'/static')

def create_dic(arr, parent, arr_parent, pos):
  dic = {"order": []}
  for i in arr:
    dic[i[0]] = {
    	"id": i[0],
      "name": i[1],
      "number": i[2],
      "children": [],
      "pos": []
      }
    dic["order"].append(i[0])
    if parent == True:
      dic[i[0]]["parent"] = i[3]
      arr_parent[i[3]]["children"].append(i[0])
    if pos == True:
    	  if i[4] != None and i[4] != "None" and  i[4] != "":
    			k = i[4].replace(" ","").split(",")
    			dic[i[0]]["pos"] = k
  return dic, arr_parent

def bubbleSort(param, a):   
  i = len(a)
  while i > 1:
     for j in xrange(i - 1):
          if a[j][param] < a[j + 1][param]:
              a[j], a[j+1] = a[j+1], a[j]
     i -= 1
  return a

def collapse(param, a):
  a = bubbleSort(0, a)
  
  i = 0
  while(i < len(a) - 1):
    if(a[i][0] == a[i + 1][0]):
      a.pop(i + 1)
      a[i][param] = a[i][param] + 1
    else:
      i = i + 1
  return a

def secureKW(s):
  s = s.strip().lower()
  p = re.compile(u'[^a-z0-9а-я\- ]')
  s = p.sub("$", s)
  s = re.subn(r'\s+', ' ', s)[0]
  s = s.split("$")
  k = "$"
  for i in reversed(range(len(s))):
  	if s[i] != "":
  		k = k + s[i].strip() + "$"
  	else:
  		s.pop(i)
  return k

def secureSearch(s):
  s = s.strip().lower()
  p = re.compile(u'[^a-z0-9а-я\- ]')
  s = p.sub(" ", s)
  s = re.subn(r'\s+', ' ', s)[0]
  return s

def isInGood(s):
  gw = [u"кпд", u"вес", u"мкт", u"газ", u"эдс"]
  for i in gw:
    if s == i:
      return True
  return False


def goodWords(s):
  s = s.split(" ")
  s = [i.strip() for i in s]
  for i in reversed(range(len(s))):
    if len(s[i]) < 4 and not isInGood(s[i]):
      s.pop(i)
  return s

def bad_words(s):
  bw = [u"Тело", u"тела", u"телу", u"телом", u"теле",
                 u"Точка", u"точки", u"точке", u"точкой",
                 u"сила", u"силы", u"силой", u"силе",
                 u"закон", u"закона", u"закону", u"законом", u"законе",
                 u"скорость", u"скорости", u"скоростью",
                 u"ускорение", u"ускорения", u"ускорением", u"ускорению", u"ускорении",
                 u"перемещение", u"перемещения", u"перемещением", u"перемещению",
                 u"направление", u"направления", u"направлением", u"направлению", u"направления",
                 u"путь", u"пути", u"путем",
                 u"нормальный", u"нормальное", u"нормального", u"нормальному",
                 u"действие", u"действия", u"действием", u"действии", u"действию",
                 u"движение", u"движения", u"движению", u"движением", u"движении",
                 u"вес", u"веса", u"весом", u"весе",
                 u"работа", u"работы", u"работой", u"работе",
                 u"вращение", u"вращения", u"вращением", u"вращению", u"вращении",
                 u"колебания", u"колебаний", u"колебаниями", u"колебаниях",
                 u"идеальный", u"идеального", u"идеальному", u"идеальном",
                 u"состояние", u"состояния", u"состоянием", u"состоянии"]
  for i in bw:
    if s == i:
      return True
  return False

def merge(a, sql, height):
  global cursor
  cursor.execute(sql)
  tmp =  cursor.fetchall()
  for j in tmp:
    a.append(list(j))
    a[len(a) - 1].append(height)
  return a  

@app.route('/robots.txt')
@app.route('/sitemap.xml')
@app.route('/favicon.ico')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

@app.route('/helpers<name>')
def getHelpers(name):
  return send_from_directory(app.static_folder + "/helpers", name)


@app.errorhandler(404)
def not_found(error):
    return render_template(r'error.html')

@app.route('/')
def index():
  id = request.args.get('_escaped_fragment_')
  if id == None:
    return render_template(r'index.html')
  else:
    global cursor
    if id == "":
      sql = "SELECT special_content, special_date FROM special WHERE special_id = 1;"
    else:
      if id[1] == "e":
        sql = "SELECT special_content, special_date FROM special WHERE special_id = 2;"
      else:
        if id[1] == 'a':
          id = int(re.sub(  r"\D", "", id))
          sql = "SELECT paragraph_content, paragraph_date FROM paragraph WHERE paragraph_id = %s;" %id
        else:
          id = int(re.sub(  r"\D", "", id))
          sql = "SELECT problem_content, problem_date FROM problem WHERE problem_id = %s;" %id

    cursor.execute(sql)
    data = cursor.fetchone();
    LM = data[1].strftime('%a, %d %b %Y %H:%M:%S GMT')
    expires = data[1].replace(month = (data[1].month + 1) % 12).strftime('%a, %d %b %Y %H:%M:%S GMT')
    content = re.findall("<body>(.*)</body>", data[0], re.S)
    if len(content) == 0:
    	content = data
    resp = make_response(render_template(r'bot_answer.html', body = content[0]))
    resp.headers['Last-Modified'] = LM
    resp.headers['Expires'] = expires
    return resp

@app.route('/getHome')
def getHome():
  global cursor
  sql = "SELECT special_name, special_content, special_date FROM  special WHERE special_id = 4;"
  cursor.execute(sql)
  data = cursor.fetchone();
  resp = make_response(jsonify(content = data[1], title = data[0]))
  resp.headers['Last-Modified'] = data[2].strftime('%a, %d %b %Y %H:%M:%S GMT')
  return resp

@app.route('/getError')
def getError():
  global cursor
  sql = "SELECT special_name, special_content, special_date FROM  special WHERE special_id = 3;"
  cursor.execute(sql)
  data = cursor.fetchone();
  resp = make_response(jsonify(content = data[1], title = data[0]))
  resp.headers['Last-Modified'] = data[2].strftime('%a, %d %b %Y %H:%M:%S GMT')
  return resp

@app.route('/getHelp')
def getHelp():
  global cursor
  sql = "SELECT special_name, special_content, special_date FROM  special WHERE special_id = 2;"
  cursor.execute(sql)
  data = cursor.fetchone();
  resp = make_response(jsonify(content = data[1], title = data[0]))
  resp.headers['Last-Modified'] = data[2].strftime('%a, %d %b %Y %H:%M:%S GMT')
  return resp

@app.route('/showParagraph')
def showParagraph():
  global cursor

  paragraph_id = request.args.get('paragraph')
  if root == r"/home/virtwww/w_123physics-ru_7f500369/http/dev/dev":
    sql = "SELECT paragraph_content, paragraph_date FROM paragraph WHERE paragraph_id = %s;" % paragraph_id
  else:
    sql = "SELECT paragraph_tmp, paragraph_date FROM paragraph WHERE paragraph_id = %s;" % paragraph_id
  cursor.execute(sql)
  paragraph = cursor.fetchone()
  resp = make_response(jsonify(content = paragraph))
  resp.headers['Last-Modified'] = paragraph[1].strftime('%a, %d %b %Y %H:%M:%S GMT')
  return resp

@app.route('/showSum')
def showSum():
  global cursor
  number = request.args.get('number')
  if root == r"/home/virtwww/w_123physics-ru_7f500369/http/dev/dev":
    sql = "SELECT prompt_name, prompt_content, paragraph_id FROM prompt WHERE prompt_id = %s;" % number
  else:
    sql = "SELECT prompt_name, prompt_tmp, paragraph_id FROM prompt WHERE prompt_id = %s;" % number
  cursor.execute(sql)
  sum = cursor.fetchall()
  return jsonify(result = sum)

@app.route('/showProblem')
def showProblem():
  global cursor

  problem_id = request.args.get('problem')
  if root == r"/home/virtwww/w_123physics-ru_7f500369/http/dev/dev":
    sql = "SELECT problem_content, problem_date FROM problem WHERE problem_id = %s;" % problem_id
  else:
    sql = "SELECT problem_tmp, problem_date FROM problem WHERE problem_id = %s;" % problem_id
  cursor.execute(sql)
  problem = cursor.fetchone()
  resp = make_response(jsonify(content = problem))
  resp.headers['Last-Modified'] = problem[1].strftime('%a, %d %b %Y %H:%M:%S GMT')
  return resp

@app.route('/search')
def search():
  global cursor
  paragraph = []
  problem = []

  req = request.args.get('request')
  req = secureSearch(req)
  req_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
  sql = 'INSERT INTO  search (request, time) VALUES ("%s", "%s");'%(req, req_time)
  cursor.execute(sql)
  db.commit()

  sql = "SELECT paragraph_id FROM paragraph WHERE paragraph_keys  LIKE '%$"+req+"$%';" 
  paragraph = merge(paragraph, sql, 10)

  sql = "SELECT problem_id FROM problem WHERE problem_keys  LIKE '%$"+req+"$%';" 
  problem = merge(problem, sql, 10)
  req = goodWords(req)
  if(len(req) == 1):
    tmp = -1
  else:
    tmp = 1
  for i in req:
    # if bad_words(i):
      # tmp = -2
    sql = "SELECT paragraph_id FROM paragraph WHERE paragraph_keys  LIKE '%"+i+"%';"
    paragraph = merge(paragraph, sql, tmp)

    sql = "SELECT problem_id FROM problem WHERE problem_keys  LIKE '%"+i+"%';" 
    problem = merge(problem, sql, tmp)

  paragraph = collapse(1, paragraph)
  problem = collapse(1, problem)
  for i in paragraph:
    tmp = i
    tmp.append("paragraph")
    problem.append(tmp)
  return jsonify(result = problem)

@app.route('/feedback')
def feedback():
  global cursor

  text = request.args.get('text')
  sql = 'INSERT INTO feedback (feedback_text) VALUES ("%s");'%text
  cursor.execute(sql)
  db.commit()
  return jsonify(result = text)

@app.route('/saveimg', methods=['GET', 'POST'])
def upload_file():
  global cursor
  global root
  if request.method == 'POST':
    files = dict(request.files)['file']
    for i in files:
      name = i.filename

      i.save(os.path.join(root + r'/static/image', "filename.png"))
      fin = open(root + r'/static/image/filename.png','rb')    
      img = fin.read()
      sql = "SELECT image_id FROM image WHERE image_name = '%s';" %name
      cursor.execute(sql)
      t = cursor.fetchone()
      if t == None:
        cursor.execute('INSERT INTO  image (image, image_name) VALUES (%s, %s);',(img, name))
      else:
        cursor.execute('UPDATE  image SET image = %s, image_type = 1 WHERE image_id = %s;',(img, t[0]))
      db.commit() 
  return render_template(r'editor.html')



@app.route('/getimg<name>')
def getimg(name):
  global cursor
  sql = "SELECT image FROM image WHERE image_name = '%s'"  %name
  cursor.execute(sql)
  data = cursor.fetchone()[0]
  return data

@app.route('/' + editor)
def edit():
  return render_template('editor.html', par_id = 0, pr_num = 0)

@app.route('/distCourses')
def distCourses():
  return render_template('distCourses.html')

@app.route('/' + editor + '/fill')
def fill():
  sqls = ["SELECT  book_description, book_name, book_number FROM  book WHERE book_id = %s;", 
          "SELECT  chapter_description, chapter_name, chapter_number FROM  chapter WHERE chapter_id = %s;", 
          "SELECT  paragraph_content, paragraph_description, paragraph_keys, paragraph_name, paragraph_number, paragraph_pos FROM  paragraph WHERE paragraph_id = %s;", 
          "SELECT  problem_content, problem_keys, problem_name, problem_number, problem_pos FROM  problem WHERE problem_id = %s;", 
          "SELECT  prompt_content, prompt_name, prompt_number FROM  prompt WHERE prompt_id = %s;"]
  global cursor
  A = int(request.args.get('A'))
  B = int(request.args.get('B'))
  cursor.execute(sqls[A] % B)
  rez = cursor.fetchall()
  return jsonify(res = rez)

@app.route('/' + editor + '/data')
def data():
  global cursor
  A = int(request.args.get('A'))
  B = int(request.args.get('B'))
  sqls = [["", 
    "SELECT book_id, book_name FROM  book ORDER BY book_number;", 
    "SELECT chapter.chapter_id, book.book_name, chapter.chapter_name FROM  book, chapter WHERE book.book_id = chapter.book_id ORDER BY book_number, chapter_number;", 
    "SELECT paragraph.paragraph_id, book.book_name, chapter.chapter_name, paragraph.paragraph_name FROM  book, chapter, paragraph WHERE book.book_id = chapter.book_id AND paragraph.chapter_id = chapter.chapter_id ORDER BY book_number, chapter_number, paragraph_number;",
    "SELECT paragraph.paragraph_id, book.book_name, chapter.chapter_name, paragraph.paragraph_name FROM  book, chapter, paragraph WHERE book.book_id = chapter.book_id AND paragraph.chapter_id = chapter.chapter_id ORDER BY book_number, chapter_number, paragraph_number;" ], [      
    "SELECT book_id, book_name FROM  book ORDER BY book_number;", 
    "SELECT chapter.chapter_id, book.book_name, chapter.chapter_name FROM  book, chapter WHERE book.book_id = chapter.book_id ORDER BY book_number, chapter_number;", 
    "SELECT paragraph.paragraph_id, book.book_name, chapter.chapter_name, paragraph.paragraph_name FROM  book, chapter, paragraph WHERE book.book_id = chapter.book_id AND paragraph.chapter_id = chapter.chapter_id ORDER BY book_number, chapter_number, paragraph_number;", 
    "SELECT problem.problem_id, book.book_name, chapter.chapter_name, paragraph.paragraph_name, problem.problem_name FROM  book, chapter, paragraph, problem WHERE book.book_id = chapter.book_id AND chapter.chapter_id = paragraph.chapter_id AND paragraph.paragraph_id = problem.paragraph_id ORDER BY book_number, chapter_number, paragraph_number,problem_number;", 
    "SELECT prompt_id, prompt_name, prompt_number FROM  prompt ORDER BY prompt_number;"]
  ]
  if (A + B != 0):
    cursor.execute(sqls[B][A])
    return jsonify(res = cursor.fetchall(), r = sqls[B][A])
  return jsonify(res = [[]])

@app.route('/submit', methods=['GET', 'POST'])
def submit():
  global cursor
  rez = json.loads(request.values['A']) 
  B = int(request.values['B'])
  C = int(request.values['C'])
  if B > 0 or C > 0:
    req = str(request.values['D'])
  else:
  	req = 0
  s = 'src = "h'
  rez['c0'] = rez['c0'].replace("'", '"').replace('src="h', s)
  if C == 3:
    rez['c1'] = rez['c1'].replace("'", '"').replace('src="', s)

  s = 'src = "/getimg'
  rez['c0'] = rez['c0'].replace("'", '"').replace('src="', s)
  if C == 3:
    rez['c1'] = rez['c1'].replace("'", '"').replace('src="', s)

  sqls = [ 
    ["""INSERT INTO book (book_number, book_name, book_description) VALUES (%s, '%s', '%s');""" %(rez['c2'], rez['c1'], rez['c0']), 
    """INSERT INTO chapter (chapter_number, chapter_name, chapter_description, book_id) VALUES (%s, '%s', '%s', '%s');""" %(rez['c2'], rez['c1'], rez['c0'], req), 
    """INSERT INTO paragraph (paragraph_number, paragraph_name, paragraph_description, paragraph_keys, paragraph_content, chapter_id) VALUES (%s, '%s', '%s', '%s', '%s', %s);""" %(rez['c4'], rez['c3'], rez['c1'], secureKW(rez['c2']), rez['c0'], req), 
    """INSERT INTO problem (problem_number, problem_name, problem_keys, problem_content, paragraph_id) VALUES (%s, '%s', '%s', '%s', '%s');""" %(rez['c3'], rez['c2'], secureKW(rez['c1']), rez['c0'], req), 
    """INSERT INTO prompt (prompt_number, prompt_name, prompt_content, paragraph_id) VALUES (%s, '%s', '%s', '%s');""" %(rez['c2'], rez['c1'], rez['c0'], req)], 
    ["""UPDATE book SET book_number = %s, book_name = '%s', book_description = '%s' WHERE book_id = %s;""" %(rez['c2'], rez['c1'], rez['c0'], req), 
    """UPDATE chapter SET chapter_number = %s, chapter_name = '%s', chapter_description = '%s' WHERE chapter_id = %s;""" %(rez['c2'], rez['c1'], rez['c0'], req), 
    """UPDATE paragraph SET paragraph_number = %s, paragraph_name = '%s', paragraph_description = '%s', paragraph_keys = '%s', paragraph_content = '%s', paragraph_pos = '%s' WHERE paragraph_id = %s;""" %(rez['c4'], rez['c3'], rez['c1'], secureKW(rez['c2']), rez['c0'], rez['c5'], req), 
    """UPDATE problem SET problem_number = %s, problem_name = '%s', problem_keys = '%s', problem_content = '%s', problem_pos = '%s' WHERE problem_id = %s;""" %(rez['c3'], rez['c2'], secureKW(rez['c1']), rez['c0'], rez['c4'], req), 
    """UPDATE prompt SET prompt_number = %s, prompt_name = '%s', prompt_content = '%s' WHERE prompt_id = %s;""" %(rez['c2'], rez['c1'], rez['c0'], req)]
  ]

  cursor.execute(sqls[B][C])
  db.commit()
  return jsonify(res = rez)

@app.route('/addFile')
def addFile():
  name = request.files['file'].filename
  return jsonify(name = name)

@app.route('/' + base)
def ShowDB():
  return render_template(r'data_base.html',par_id = 0, pr_num = 0)

@app.route('/' + editor + '/getAllProblems')
def getAllProblems():

  sql = "SELECT problem_id, paragraph_id, problem_number FROM problem;"
  cursor.execute(sql)
  t =  cursor.fetchall()
  return jsonify(problems = t)

@app.route('/getAll')
def getAll():
  global cursor
  list = ['paragraph', 'problem', 'prompt', 'search']
  cursor.execute( "SELECT book_id, book_number, book_name FROM  book;")
  book = cursor.fetchall()
  cursor.execute( "SELECT chapter_id, chapter_number, chapter_name, book_id FROM  chapter;")
  chapter = cursor.fetchall()
  cursor.execute( "SELECT * FROM  search;")
  search = cursor.fetchall()
  cursor.execute( "SELECT image_id, image_name FROM  image;")
  image = cursor.fetchall()
  cursor.execute( "SELECT paragraph_id, paragraph_number, paragraph_name, chapter_id, paragraph_pos, paragraph_keys FROM  paragraph;")
  paragraph = cursor.fetchall()
  cursor.execute( "SELECT problem_id, problem_number, problem_name, paragraph_id, problem_pos, problem_keys FROM  problem;")
  problem = cursor.fetchall()
  cursor.execute( "SELECT prompt_id, prompt_number, prompt_name, paragraph_id FROM  prompt;")
  prompt = cursor.fetchall()
  cursor.execute( "SELECT feedback_id, feedback_text, feedback_time FROM  feedback;")
  feedback = cursor.fetchall()

  return jsonify(book =  book, chapter = chapter, paragraph = paragraph, problem = problem, prompt = prompt, search = search, image = image, feedback = feedback)

@app.route('/' + editor + '/delete')
def delete():
  type = int(request.args.get('type'))
  id = int(request.args.get('id'))
  sqls = ["DELETE FROM book WHERE book_id = %s;",
          "DELETE FROM chapter WHERE chapter_id = %s;",
          "DELETE FROM paragraph WHERE paragraph_id = %s;",
          "DELETE FROM problem WHERE problem_id = %s;",
          "DELETE FROM prompt WHERE promp_id = %s;"
          ]
  sql = sqls[type] %id
  cursor.execute(sql)
  return jsonify(sql = sql)
  
@app.route('/TOC')
def TOC():
  global cursor

  sql = "SELECT  book_id, book_name, book_number FROM  book ORDER BY book_number;"
  cursor.execute(sql)
  books = cursor.fetchall()
  books_dic = create_dic(books, False, [], False)[0]

  sql = "SELECT  chapter.chapter_id, chapter.chapter_name, chapter.chapter_number, chapter.book_id FROM  book, chapter WHERE book.book_id = chapter.book_id ORDER BY book_number, chapter_number;"
  cursor.execute(sql)
  ch = cursor.fetchall()
  chapters_dic, books_dic = create_dic(ch, True, books_dic, False)

  sql = "SELECT  paragraph.paragraph_id, paragraph.paragraph_name, paragraph.paragraph_number, paragraph.chapter_id, paragraph.paragraph_pos FROM  book, chapter, paragraph WHERE book.book_id = chapter.book_id AND paragraph.chapter_id = chapter.chapter_id ORDER BY book_number, chapter_number, paragraph_number;"
  cursor.execute(sql)
  par = cursor.fetchall()
  paragraphs_dic, chapters_dic = create_dic(par, True, chapters_dic, True)

  sql = "SELECT  problem.problem_id, problem.problem_name, problem.problem_number, problem.paragraph_id, problem.problem_pos FROM  book, chapter, paragraph, problem WHERE book.book_id = chapter.book_id AND paragraph.chapter_id = chapter.chapter_id AND problem.paragraph_id = paragraph.paragraph_id ORDER BY book_number, chapter_number, paragraph_number, problem_number;"
  cursor.execute(sql)
  pr = cursor.fetchall()
  problems_dic, paragraphs_dic = create_dic(pr, True, paragraphs_dic, True)

  return jsonify(books = books_dic, chapters = chapters_dic, paragraphs = paragraphs_dic, problems = problems_dic)



if (__name__ == '__main__'):
  app.run(debug = True, port = 5000)
